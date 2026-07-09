import pandas as pd

def calculate_daily_returns(prices_df):
    """
    Converts a DataFrame of daily closing prices into daily percentage returns.
    """
    print("Calculating daily percentage returns...")
    
    # pct_change() applies the return formula to every cell comparing it to the row above
    returns = prices_df.pct_change()
    
    # The first row will be NaN (Not a Number) because there is no previous day to compare it to.
    # We must drop this row to prevent mathematical errors later.
    returns = returns.dropna()
    
    return returns