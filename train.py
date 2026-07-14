import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader

from model import TemporalCNN
from dataset import PortfolioDataset, CONFIG, download_and_prepare_data


def train():
    # 1. Setup Device
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print("--- Starting Training ---", flush=True)
    print(f"Using Device: {device}\n", flush=True)

    # 2. Ensure Data is Downloaded & Ready
    print("Checking / Downloading Dataset...", flush=True)
    download_and_prepare_data(CONFIG)

    # 3. Hyperparameters
    batch_size = 32
    learning_rate = 0.001
    num_epochs = 150

    # 4. Load Dataset
    print("Loading Dataset into DataLoader...", flush=True)
    train_dataset = PortfolioDataset(config=CONFIG)
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)

    print(f"Total trading days available for training: {len(train_dataset)}", flush=True)
    print(f"Number of assets: {train_dataset.num_assets}", flush=True)
    print(f"Features per asset: {train_dataset.features_per_asset}\n", flush=True)

    # 5. Initialize Model, Loss Function, and Optimizer
    print("Initializing Model...", flush=True)
    model = TemporalCNN(
        num_assets=train_dataset.num_assets,
        features_per_asset=train_dataset.features_per_asset,
        hidden_channels=CONFIG["HIDDEN_CHANNELS"],
        dropout=CONFIG["DROPOUT"],
    ).to(device)

    criterion = nn.HuberLoss()
    optimizer = optim.AdamW(model.parameters(), lr=learning_rate, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(
        optimizer, mode='min', factor=0.5, patience=5, min_lr=1e-6
    )

    # 6. Training Loop
    print("\nStarting Epochs...", flush=True)
    for epoch in range(num_epochs):
        model.train()
        running_loss = 0.0

        for batch_idx, (features, targets) in enumerate(train_loader):
            features = features.to(device)
            targets = targets.to(device)

            optimizer.zero_grad()
            predictions = model(features)
            loss = criterion(predictions, targets)
            loss.backward()

            # Gradient clipping to prevent gradient explosions / instability across batches
            nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)

            optimizer.step()

            running_loss += loss.item()

        avg_loss = running_loss / len(train_loader)
        scheduler.step(avg_loss)

        if (epoch + 1) == 1 or (epoch + 1) % 10 == 0:
            current_lr = optimizer.param_groups[0]['lr']
            print(f"Epoch [{epoch+1:02d}/{num_epochs}] | Huber Loss: {avg_loss:.6f} | LR: {current_lr:.6f}", flush=True)

    # 7. Save the Trained Model
    save_path = CONFIG["MODEL_PATH"]
    torch.save(model.state_dict(), save_path)
    print(f"\nTraining complete! Model weights saved to '{save_path}'", flush=True)


if __name__ == "__main__":
    train()