import numpy as np
import pandas as pd

import torch
from torch.utils.data import Dataset


class PortfolioDataset(Dataset):
    """
    Dataset for portfolio return prediction.

    Input
    -----
    Previous `window_size` trading days of engineered features.

    Target
    ------
    Forward return after `prediction_horizon` trading days
    for every asset.

    Returned Shapes
    ----------------
    X : (window_size, num_assets, features_per_asset)

    y : (num_assets,)
    """

    def __init__(
        self,
        feature_csv="data/engineered_data.csv",
        price_csv="data/sp500_historical_data.csv",
        window_size=30,
        prediction_horizon=21,
    ):

        self.window_size = window_size
        self.prediction_horizon = prediction_horizon

        # --------------------------------------------------
        # Load engineered features
        # --------------------------------------------------

        self.features = pd.read_csv(
            feature_csv,
            index_col=0,
            parse_dates=True,
        )

        # --------------------------------------------------
        # Load prices
        # --------------------------------------------------

        self.prices = pd.read_csv(
            price_csv,
            index_col=0,
            parse_dates=True,
        )

        # Align dates

        self.prices = self.prices.loc[self.features.index]

        self.tickers = list(self.prices.columns)

        self.num_assets = len(self.tickers)

        self.features_per_asset = (
            len(self.features.columns) // self.num_assets
        )

        # --------------------------------------------------
        # Future Returns (Targets)
        # --------------------------------------------------

        future_prices = self.prices.shift(
            -prediction_horizon
        )

        self.targets = (
            future_prices / self.prices
        ) - 1

        # Remove rows without future targets

        valid_rows = len(self.features) - prediction_horizon

        self.features = self.features.iloc[:valid_rows]
        self.targets = self.targets.iloc[:valid_rows]

        # Convert once to NumPy for faster indexing

        self.feature_array = self.features.to_numpy(
            dtype=np.float32
        )

        self.target_array = self.targets.to_numpy(
            dtype=np.float32
        )

    def __len__(self):

        return len(self.feature_array) - self.window_size + 1

    def __getitem__(self, idx):

        start = idx
        end = idx + self.window_size

        # --------------------------------------------------
        # Input Sequence
        # --------------------------------------------------

        x = self.feature_array[start:end]

        # Current shape:
        #
        # (30, 54)
        #
        # Desired:
        #
        # (30, 3, 18)
        #

        x = x.reshape(
            self.window_size,
            self.num_assets,
            self.features_per_asset,
        )

        # --------------------------------------------------
        # Target
        # --------------------------------------------------

        y = self.target_array[end - 1]

        return (
            torch.from_numpy(x),
            torch.from_numpy(y),
        )


if __name__ == "__main__":

    dataset = PortfolioDataset()

    print(f"Dataset Size : {len(dataset)}")

    x, y = dataset[0]

    print("Input Shape :", x.shape)
    print("Target Shape:", y.shape)

    print()

    print("Number of Assets :", dataset.num_assets)
    print("Features / Asset :", dataset.features_per_asset)

    print()

    print("Example Target:")

    for ticker, value in zip(dataset.tickers, y):
        print(f"{ticker}: {value.item():.4f}")