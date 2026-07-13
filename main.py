import os
import torch
import numpy as np
import pandas as pd

# Import shared config & dataset prep
from dataset import CONFIG, download_and_prepare_data
from optimizer import (
    calculate_daily_returns,
    calculate_annualized_covariance,
    calculate_portfolio_metrics,
    optimize_portfolio,
)
from model import TemporalCNN


def main():
    # =========================================================
    # 1. LOAD DATA & CALCULATE RISK
    # =========================================================
    print("=== 1. Loading & Preparing Dataset ===", flush=True)
    historical_data, engineered_features, tickers = download_and_prepare_data(CONFIG)

    daily_returns = calculate_daily_returns(historical_data)
    cov_matrix = calculate_annualized_covariance(daily_returns)

    print("\n--- Annualized Covariance Matrix (Risk) ---", flush=True)
    print(cov_matrix, flush=True)

    # =========================================================
    # 2. LOAD THE TRAINED AI MODEL
    # =========================================================
    print("\n=== 2. Loading Trained AI Model ===", flush=True)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    model = TemporalCNN(
        num_assets=len(tickers),
        features_per_asset=CONFIG["FEATURES_PER_ASSET"],
        hidden_channels=CONFIG["HIDDEN_CHANNELS"],
        dropout=CONFIG["DROPOUT"],
    ).to(device)

    model_path = CONFIG["MODEL_PATH"]
    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"Model weights file '{model_path}' not found! Please run train.py first."
        )

    model.load_state_dict(
        torch.load(model_path, map_location=device, weights_only=True)
    )
    model.eval()

    # =========================================================
    # 3. GET THE LATEST WINDOW OF DATA FOR INFERENCE
    # =========================================================
    window_size = CONFIG["WINDOW_SIZE"]
    latest_window = engineered_features.iloc[-window_size:].to_numpy(dtype=np.float32)

    latest_tensor = (
        torch.tensor(latest_window)
        .reshape(1, window_size, len(tickers), CONFIG["FEATURES_PER_ASSET"])
        .to(device)
    )

    # =========================================================
    # 4. PREDICT FUTURE RETURNS
    # =========================================================
    print("\n=== 3. Predicting Future Returns with Temporal CNN ===", flush=True)
    with torch.no_grad():
        predicted_array = model(latest_tensor).cpu().numpy()[0]

    ai_predicted_returns = pd.Series(predicted_array, index=tickers)

    print("\n--- AI Predicted Expected Returns ---", flush=True)
    for ticker, ret in ai_predicted_returns.items():
        print(f"{ticker}: {ret * 100:.2f}%", flush=True)

    # =========================================================
    # 5. RUN THE PORTFOLIO OPTIMIZER
    # =========================================================
    print("\n" + "=" * 40, flush=True)
    print("   OPTIMIZING PORTFOLIO (SHARPE RATIO)   ", flush=True)
    print("=" * 40, flush=True)

    optimal_weights = optimize_portfolio(ai_predicted_returns, cov_matrix)

    print("\n--- Optimal Portfolio Allocation ---", flush=True)
    for ticker, weight in zip(tickers, optimal_weights):
        if weight > 0.01:  # Only show weights > 1%
            print(f"{ticker}: {weight * 100:.2f}%", flush=True)

    # =========================================================
    # 6. FINAL PERFORMANCE METRICS
    # =========================================================
    opt_return, opt_variance, opt_volatility = calculate_portfolio_metrics(
        optimal_weights, ai_predicted_returns, cov_matrix
    )
    opt_sharpe = (opt_return - 0.04) / opt_volatility

    print("\n--- Expected Portfolio Performance ---", flush=True)
    print(f"Annual Return: {opt_return * 100:.2f}%", flush=True)
    print(f"Volatility (Risk): {opt_volatility * 100:.2f}%", flush=True)
    print(f"Sharpe Ratio: {opt_sharpe:.3f}", flush=True)


if __name__ == "__main__":
    main()