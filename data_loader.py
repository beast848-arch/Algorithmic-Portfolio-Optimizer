import os
import pandas as pd
import yfinance as yf

def get_sp500_tickers():
    """
    Scrapes the current S&P 500 ticker list from Wikipedia.
    """
    print("Fetching S&P 500 ticker list from Wikipedia...")
    url = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
    
    # read_html returns a list of tables; the first table contains the company data
    tables = pd.read_html(url, storage_options={'User-Agent': 'Mozilla/5.0'})
    df = tables[0]
    
    tickers = df['Symbol'].tolist()
    
    # CRITICAL CLEANING STEP:
    # Yahoo Finance uses hyphens (-) instead of dots (.) for share classes.
    # For example, Berkshire Hathaway (BRK.B) must be converted to BRK-B.
    cleaned_tickers = [ticker.replace('.', '-') for ticker in tickers]
    
    return cleaned_tickers

def load_portfolio_data(tickers=None, period="3y", filename="sp500_historical_data.csv"):
    """
    Loads historical adjusted close data. 
    If a local CSV exists, it loads from the disk. Otherwise, it downloads fresh data.
    """
    # If a local CSV file already exists, load it immediately to save time and bandwidth
    if os.path.exists(filename):
        print(f"Loading data from local cache: '{filename}'...")
        # Ensure the Date column is parsed as dates and set as the DataFrame index
        return pd.read_csv(filename, index_col="Date", parse_dates=True)
    
    # If no tickers are provided, default to fetching the entire S&P 500
    if tickers is None:
        tickers = get_sp500_tickers()
        
    print(f"Downloading data for {len(tickers)} assets from Yahoo Finance...")
    
    # Download data using group_by='column' to simplify extracting Adjusted Close
    raw_data = yf.download(tickers, period=period, interval="1d")
    
    # Isolate Adjusted Close prices
    closing_prices = raw_data['Close']
    
    # Clean up missing data caused by companies listing/delisting within the 3-year window
    closing_prices = closing_prices.ffill().bfill()
    
    # Save to a local CSV file for future runs
    closing_prices.to_csv(filename)
    print(f"Data successfully saved to '{filename}'!")
    
    return closing_prices


