from __future__ import annotations

import re
from datetime import datetime
from typing import Literal

import numpy as np
import pandas as pd
import scipy.optimize as sco
import yfinance as yf
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, field_validator
from sklearn.covariance import LedoitWolf

app = FastAPI(title="Vector Alpha Portfolio API", version="1.0.0")

SUPPORTED = {"AAPL","MSFT","NVDA","AVGO","AMD","ADBE","QCOM","LLY","UNH","JNJ","ABBV","JPM","V","MA","GS","BAC","GOOGL","META","NFLX","AMZN","TSLA","HD","PG","KO","COST","XOM","CVX","CAT","GE","UNP","NEE","PLD","GLD","TLT","IEF"}
PERIODS = {"1y": 252, "3y": 756, "5y": 1260}

class OptimizeRequest(BaseModel):
    tickers: list[str] = Field(min_length=2, max_length=12)
    lookback: Literal["1y", "3y", "5y"] = "3y"
    objective: Literal["max_sharpe", "min_volatility"] = "max_sharpe"
    max_weight: float = Field(default=0.35, ge=0.08, le=1.0)

    @field_validator("tickers")
    @classmethod
    def normalize_tickers(cls, values: list[str]) -> list[str]:
        result = []
        for value in values:
            ticker = value.strip().upper().replace(".", "-")
            if not re.fullmatch(r"[A-Z0-9-]{1,10}", ticker):
                raise ValueError(f"Invalid ticker: {value}")
            if ticker not in result:
                result.append(ticker)
        if len(result) < 2:
            raise ValueError("Enter at least two unique tickers")
        return result

def metrics(weights: np.ndarray, returns: pd.Series, covariance: pd.DataFrame) -> tuple[float, float]:
    expected = float(np.dot(weights, returns))
    volatility = float(np.sqrt(weights @ covariance.to_numpy() @ weights))
    return expected, volatility

def solve(expected: pd.Series, covariance: pd.DataFrame, objective: str, max_weight: float) -> np.ndarray:
    count = len(expected)
    cap = max(max_weight, 1 / count)
    initial = np.repeat(1 / count, count)
    def target(weights: np.ndarray) -> float:
        ret, vol = metrics(weights, expected, covariance)
        return vol if objective == "min_volatility" else -((ret - 0.04) / max(vol, 1e-9))
    result = sco.minimize(target, initial, method="SLSQP", bounds=[(0, cap)] * count,
        constraints={"type": "eq", "fun": lambda w: np.sum(w) - 1}, options={"maxiter": 500})
    if not result.success:
        raise HTTPException(422, detail="The requested constraints could not produce a portfolio.")
    return result.x

def frontier(expected: pd.Series, covariance: pd.DataFrame, max_weight: float) -> list[dict]:
    count = len(expected)
    cap = max(max_weight, 1 / count)
    initial = np.repeat(1 / count, count)
    points = []
    for target_return in np.linspace(float(expected.min()), float(expected.max()), 24):
        result = sco.minimize(lambda w: metrics(w, expected, covariance)[1], initial, method="SLSQP",
            bounds=[(0, cap)] * count,
            constraints=[{"type":"eq","fun":lambda w: np.sum(w)-1}, {"type":"eq","fun":lambda w, t=target_return: np.dot(w, expected)-t}])
        if result.success:
            ret, vol = metrics(result.x, expected, covariance)
            points.append({"risk": round(vol * 100, 2), "return": round(ret * 100, 2)})
    return points

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/optimize")
def optimize(payload: OptimizeRequest):
    try:
        raw = yf.download(payload.tickers, period=payload.lookback, auto_adjust=True, progress=False, threads=True)
        prices = raw["Close"] if isinstance(raw.columns, pd.MultiIndex) else raw
        if isinstance(prices, pd.Series):
            prices = prices.to_frame(payload.tickers[0])
        prices = prices.dropna(axis=1, how="all").ffill().dropna()
    except Exception as exc:
        raise HTTPException(503, detail="Market data is temporarily unavailable. Please try again.") from exc
    missing = [ticker for ticker in payload.tickers if ticker not in prices.columns]
    if missing:
        raise HTTPException(422, detail=f"No usable market data for: {', '.join(missing)}")
    if len(prices) < 120:
        raise HTTPException(422, detail="Not enough aligned price history for this portfolio.")
    daily = prices[payload.tickers].pct_change().dropna()
    expected = daily.mean() * 252
    covariance = pd.DataFrame(LedoitWolf().fit(daily).covariance_ * 252, index=payload.tickers, columns=payload.tickers)
    weights = solve(expected, covariance, payload.objective, payload.max_weight)
    p_return, p_vol = metrics(weights, expected, covariance)
    # The web endpoint uses a consistent historical estimator for arbitrary universes.
    # The repository's Temporal CNN remains available as a documented research pipeline.
    method = "historical"
    assets = []
    for ticker, weight in zip(payload.tickers, weights):
        series = daily[ticker]
        assets.append({"ticker":ticker,"weight":round(float(weight)*100,2),"expectedReturn":round(float(expected[ticker])*100,2),"volatility":round(float(series.std()*np.sqrt(252))*100,2),"lastPrice":round(float(prices[ticker].iloc[-1]),2)})
    assets.sort(key=lambda item: item["weight"], reverse=True)
    return {"method":method,"asOf":datetime.utcnow().strftime("%b %d, %Y"),"observations":len(daily),
        "metrics":{"expectedReturn":round(p_return*100,2),"volatility":round(p_vol*100,2),"sharpe":round((p_return-.04)/max(p_vol,1e-9),2),"diversification":round(1-float(np.sum(weights**2)),2)},
        "assets":assets,"frontier":frontier(expected,covariance,payload.max_weight)}
