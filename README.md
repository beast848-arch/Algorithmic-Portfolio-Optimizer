# 📈 Algorithmic Portfolio Optimizer

> **AI-powered portfolio optimization** combining a Temporal CNN for return prediction with Modern Portfolio Theory (MPT) to maximize risk-adjusted returns across 174 S&P 500 assets.

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
- 🌐 **Interactive Web Dashboard & AI Backend** — Pick stocks in the browser and fetch live predictions from the Flask AI server
- 💾 **Smart data caching** — downloads once, reuses locally for lightning-fast inference
- 🎯 **174-asset multi-sector universe** covering Tech, Healthcare, Financials, Energy, and macro safe havens

---

## 🗂️ Project Structure

```
Algorithmic-Portfolio-Optimizer/
│
├── app.py                        # Flask API Backend for the Web UI
├── main.py                       # CLI End-to-end inference pipeline
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

### 4. Run the AI Backend & Dashboard

```bash
python app.py
```

This will:
- Download historical price data from Yahoo Finance (and cache it)
- Engineer 20 technical features per asset
- Load the pretrained `temporal_cnn_weights.pth` model into memory
- Pre-compute the historical covariance matrix
- Start a Flask server on `http://127.0.0.1:5000`

Once the server is running, open `website/index.html` in any web browser to use the interactive AI-powered dashboard!

### 5. CLI Inference (Optional)

If you prefer to run the pipeline via terminal instead of the web dashboard:
```bash
python main.py
```

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
Input: (batch, window=63, assets=174, features=20)
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
 (batch, assets×64 = 11136)
          │
          ▼  Linear(11136, 128) → ReLU → Dropout → Linear(128, 174)
          │
Output: (batch, 174)  — predicted excess returns per asset
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

## 🌐 Web Dashboard & AI Server

An interactive, browser-based portfolio builder lives in the `website/` folder.

1. Ensure the backend is running (`python app.py`).
2. Open `website/index.html` in any modern browser.
3. Browse and select your desired stocks from the S&P 500.
4. Click **Calculate**. The frontend will instantly query the Flask AI server, which dynamically runs inference for your selected assets, solves for the maximum Sharpe ratio, and returns the mathematically optimal weights and predicted returns.

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `torch >= 2.7` | TemporalCNN model & training |
| `flask`, `flask-cors` | Backend AI API for Web Dashboard |
| `numpy >= 2.0` | Numerical computing |
| `pandas >= 2.2` | Data manipulation |
| `scipy >= 1.14` | SLSQP portfolio optimization |
| `scikit-learn >= 1.7` | Ledoit-Wolf covariance estimation |
| `yfinance >= 0.2` | Historical market data |
| `matplotlib >= 3.10` | Visualization utilities |
| `tqdm >= 4.67` | Training progress bars |

