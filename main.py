from data_loader import load_portfolio_data
from optimizer import calculate_daily_returns, calculate_annualized_returns, calculate_annualized_covariance
from optimizer import calculate_portfolio_metrics, optimize_portfolio
import numpy as np


def main():
    # 1. Fetch the data (it will load instantly from your CSV now!)
    historical_data = load_portfolio_data(tickers=["AAPL", "JNJ", "MSFT"])
    
    # 2. Calculate daily returns
    daily_returns = calculate_daily_returns(historical_data)
    
    # 3. Inspect the results
    print("\n--- Daily Percentage Returns ---")
    print(daily_returns.head())

    # 4. Inspect the results
    print("\n--- Annualized Expected Returns (%) ---")
    annualized_returns = calculate_annualized_returns(daily_returns)
    print(annualized_returns * 100)

    # 5. Calculate the Covariance Matrix
    cov_matrix = calculate_annualized_covariance(daily_returns)
    
    # 6. Inspect the Covariance Matrix
    print("\n--- Annualized Covariance Matrix ---")
    print(cov_matrix)

   # 7. Define the weight column vector
    num_assets = len(annualized_returns)
    # Let's start with an equally weighted portfolio (1/3 in each stock)
    weights = np.array([1 / num_assets] * num_assets)
    
    print("\n--- Portfolio Weights ---")
    for ticker, weight in zip(annualized_returns.index, weights):
        print(f"{ticker}: {weight * 100:.2f}%")

    # 8. Calculate Portfolio Variance and Risk
    p_return, p_variance, p_volatility = calculate_portfolio_metrics(weights, annualized_returns, cov_matrix)
    
    print("\n--- Portfolio Performance ---")
    print(f"Expected Annual Return: {p_return * 100:.2f}%")
    print(f"Portfolio Variance: {p_variance:.4f}")
    print(f"Portfolio Volatility (Risk): {p_volatility * 100:.2f}%")

    # 9. RUN THE OPTIMIZER
    print("\n" + "="*40)
    print("   OPTIMIZING PORTFOLIO (SHARPE RATIO)   ")
    print("="*40)

    # Call the SciPy engine you just built!
    optimal_weights = optimize_portfolio(annualized_returns, cov_matrix)

    print("\n--- Optimal Portfolio Weights ---")
    # We'll use a threshold of 1% so it doesn't print stocks we are essentially ignoring
    for ticker, weight in zip(annualized_returns.index, optimal_weights):
        if weight > 0.01:  
            print(f"{ticker}: {weight * 100:.2f}%")

    # 10. Calculate the performance of this new, optimized portfolio
    opt_return, opt_variance, opt_volatility = calculate_portfolio_metrics(
        optimal_weights, annualized_returns, cov_matrix
    )
    
    # Calculate the Sharpe Ratios for comparison (assuming 4% risk-free rate)
    equal_sharpe = (p_return - 0.04) / p_volatility
    opt_sharpe = (opt_return - 0.04) / opt_volatility

    print("\n--- Optimal Portfolio Performance ---")
    print(f"Expected Annual Return: {opt_return * 100:.2f}%")
    print(f"Portfolio Volatility (Risk): {opt_volatility * 100:.2f}%")
    
    print("\n--- The Final Verdict ---")
    print(f"Equal-Weight Sharpe Ratio: {equal_sharpe:.3f}")
    print(f"Optimized Sharpe Ratio:    {opt_sharpe:.3f}")




if __name__ == "__main__":
    main()