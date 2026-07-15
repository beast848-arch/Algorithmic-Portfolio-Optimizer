# 📈 Algorithmic Portfolio Optimizer

> **AI-powered portfolio optimization** combining a Temporal CNN for return prediction with Modern Portfolio Theory (MPT) to maximize risk-adjusted returns across 35 S&P 500 assets.

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue?style=flat-square&logo=python)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.7%2B-ee4c2c?style=flat-square&logo=pytorch)](https://pytorch.org/)


---

## 🧠 How It Works

This project fuses two powerful disciplines into a single pipeline:

1. **Deep Learning** — A Temporal CNN predicts 21-day forward returns for each asset using 20 engineered technical indicators per stock.
2. **Quantitative Finance** — The predicted returns feed into a Sharpe Ratio maximizer (SLSQP) with Ledoit-Wolf covariance shrinkage to find the mathematically optimal portfolio weights.

```
Market Data (yfinance)
        │
        ▼
Feature Engineering (20 indicators/asset)
        │
        ▼
 Temporal CNN Model  ──► Predicted 21-Day Returns
        │
        ▼
 Ledoit-Wolf Covariance Matrix (Risk)
        │
        ▼
 SLSQP Sharpe Ratio Optimizer
        │
        ▼
 Optimal Portfolio Weights
```

---

## ✨ Features

- 🤖 **Temporal CNN** with residual blocks for time-series return prediction
- 📊 **20 technical indicators** per asset: RSI, MACD, Bollinger Bands, EMA ratios, rolling volatility, momentum ranks, and more
- 🛡️ **Ledoit-Wolf covariance shrinkage** for robust, out-of-sample risk estimation
- ⚡ **Sharpe Ratio maximization** via SciPy SLSQP with per-asset position limits (max 35%)
- 🌐 **Interactive Web Dashboard** — pick stocks and see live results in the browser
- 💾 **Smart data caching** — downloads once, reuses locally
- 🎯 **35-asset multi-sector universe** covering Tech, Healthcare, Financials, Energy, and macro safe havens (GLD, TLT, IEF)

---

## 🗂️ Project Structure

```
Algorithmic-Portfolio-Optimizer/
│
├── main.py                       # End-to-end inference pipeline
├── train.py                      # Model training script
├── model.py                      # TemporalCNN architecture
├── dataset.py                    # CONFIG, data download & PyTorch Dataset
├── feature_eng.py                # Technical indicator engineering
├── data_loader.py                # yfinance data fetching & caching
├── optimizer.py                  # Portfolio math & SLSQP optimizer
│
├── temporal_cnn_weights.pth      # Pretrained model weights
├── requirements.txt
│
├── data/
│   ├── sp500_historical_data.csv # Cached price data
│   └── engineered_data.csv       # Cached feature matrix
│
└── website/
    ├── index.html                # Interactive portfolio builder UI
    ├── style.css
    └── script.js
```

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Algorithmic-Portfolio-Optimizer.git
cd Algorithmic-Portfolio-Optimizer
```

### 2. Create a Virtual Environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run Inference (Pretrained Weights Included)

```bash
python main.py
```

This will:
- Download 3 years of historical price data from Yahoo Finance
- Engineer 20 technical features per asset
- Load the pretrained `temporal_cnn_weights.pth`
- Predict 21-day forward returns for all 35 assets
- Compute the optimal portfolio allocation maximizing the Sharpe Ratio

---

## 🏋️ Training from Scratch

If you want to retrain the model on fresh data:

```bash
python train.py
```

**Training details:**

| Hyperparameter | Value |
|---|---|
| Epochs | 150 (with early stopping) |
| Batch Size | 32 |
| Optimizer | AdamW (lr=0.001, wd=1e-4) |
| Loss Function | Huber Loss |
| LR Scheduler | ReduceLROnPlateau (patience=5) |
| Early Stopping | Patience = 20 epochs |
| Train / Val Split | 80% / 20% (chronological) |

The best checkpoint (lowest validation loss) is saved automatically to `temporal_cnn_weights.pth`.

---

## 🧩 Model Architecture — TemporalCNN

```
Input: (batch, window=63, assets=35, features=20)
          │
          ▼  [Reshape per asset]
 (batch×assets, features=20, window=63)
          │
          ▼  Conv1d projection → BatchNorm → ReLU
 (batch×assets, hidden=64, window=63)
          │
          ▼  ResidualBlock × 2 (Conv1d + BatchNorm + Dropout)
          │
          ▼  Global Average Pooling
 (batch×assets, 64)
          │
          ▼  Reshape & Flatten
 (batch, assets×64 = 2240)
          │
          ▼  Linear(2240, 128) → ReLU → Dropout → Linear(128, 35)
          │
Output: (batch, 35)  — predicted excess returns per asset
```

Key design decisions:
- **Per-asset processing** — each asset's time series is processed independently before cross-asset fusion
- **Residual connections** — preserve gradient flow and enable deeper temporal reasoning
- **Global Average Pooling** — collapses the time dimension, making the model input-length agnostic
- **Cross-sectional targets** — market beta is subtracted from training targets to learn *relative* alpha, not market drift

---

## 📐 Feature Engineering (20 Features per Asset)

| Category | Features |
|---|---|
| **Price** | Raw price |
| **Returns** | 1-day, 5-day, 10-day, 20-day returns; log return |
| **Moving Average Ratios** | Price / MA5, MA10, MA20, MA50 |
| **Volatility** | Rolling std over 5 and 20 days |
| **Momentum** | RSI (14-period) |
| **Trend** | MACD, MACD Signal, EMA12 ratio, EMA26 ratio |
| **Mean Reversion** | Bollinger Band position |
| **Cross-Sectional Rank** | 5-day and 20-day return rank across all assets |

All features are Z-score normalized (mean=0, std=1).

---

## 📊 Portfolio Optimization

The optimizer uses **Modern Portfolio Theory (MPT)** with several enhancements:

- **Covariance Estimation**: Ledoit-Wolf shrinkage reduces estimation noise, improving out-of-sample Sharpe Ratio stability vs. sample covariance
- **Objective**: Maximize Sharpe Ratio = `(Return − Risk-Free Rate) / Volatility`, with a 4% risk-free rate
- **Constraints**: Weights sum to 100%; each position capped at **35%** to ensure diversification
- **Solver**: SLSQP (Sequential Least Squares Programming) via `scipy.optimize`

---

## 🌐 Web Dashboard

An interactive, browser-based portfolio builder lives in the `website/` folder.

Open `website/index.html` in any modern browser:
- Browse and select stocks from the full S&P 500
- Instantly see calculated annualized return, volatility, and Sharpe Ratio
- No server or backend required — runs entirely client-side

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `torch >= 2.7` | TemporalCNN model & training |
| `numpy >= 2.0` | Numerical computing |
| `pandas >= 2.2` | Data manipulation |
| `scipy >= 1.14` | SLSQP portfolio optimization |
| `scikit-learn >= 1.7` | Ledoit-Wolf covariance estimation |
| `yfinance >= 0.2` | Historical market data |
| `matplotlib >= 3.10` | Visualization utilities |
| `tqdm >= 4.67` | Training progress bars |

