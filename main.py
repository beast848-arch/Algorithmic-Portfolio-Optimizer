from data_loader import load_portfolio_data
from optimizer import calculate_daily_returns

def main():
    # 1. Fetch the data (it will load instantly from your CSV now!)
    historical_data = load_portfolio_data(tickers=["AAPL", "JNJ", "MSFT"])
    
    # 2. Calculate daily returns
    daily_returns = calculate_daily_returns(historical_data)
    
    # 3. Inspect the results
    print("\n--- Daily Percentage Returns ---")
    print(daily_returns.head())

if __name__ == "__main__":
    main()