export enum Events {
  DataFrame = 'Event:DataFrame',
  GetDataFrame = 'Event:DataFrame:Get',
  GetBalance = 'Event:Balance:Get',
  GetPositions = 'Event:Positions:Get',
  GetStats = 'Event:Stats:Get',
  GetTrades = 'Event:Trades:Get',
  UpdateTradingEnabled = 'Event:Config:Update:TradingEnabled',
  GetConfigs = 'Event:Configs:Get',
  UpdateAllowedAmount = 'Event:Config:Update:AllowedAmount',
  CriticalError = 'Event:CriticalError',
  Order = 'Event:Order',
  Trade = 'Event:Trade',
  GetStrategies = 'Event:Strategies:Get',
  UpdateStrategies = 'Event:Strategies:Update',
}

export type DataFrameEventPayload = {
  kline: Kline;
  indicators: Indicators;
  signal: Signal;
};

export type CriticalErrorEventPayload = {
  error: string;
};

export type OrderEventPayload = {
  id: number;
  side: Signal;
  type: string;
  symbol: string;
  price: number;
  quantity: number;
};

export type TradeEventPayload = {
  id: number;
  symbol: string;
  entry: number;
  exit: number;
  quantity: number;
  time: Date;
};

export type Kline = {
  symbol: string;
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  final: boolean;
};

export type Indicators = {
  adx: number;
  rsi: number;
  macd: number;
  macd_signal: number;
  macd_hist: number;
};

export enum Signal {
  BUY = 'BUY',
  SELL = 'SELL',
  NONE = 'NONE',
}
