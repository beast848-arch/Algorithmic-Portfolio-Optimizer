export type OptimizeRequest = { tickers: string[]; lookback: "1y"|"3y"|"5y"; objective: "max_sharpe"|"min_volatility"; max_weight: number };
export type AssetResult = { ticker:string; weight:number; expectedReturn:number; volatility:number; lastPrice:number };
export type OptimizationResult = { method:"historical"|"temporal_cnn_universe"; asOf:string; observations:number; metrics:{expectedReturn:number;volatility:number;sharpe:number;diversification:number}; assets:AssetResult[]; frontier:{risk:number;return:number}[] };
