export const KlineEvent = 'Event:Kline';

export type KlineEventPayload = {
  kline: Kline;
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

export const DataFrameEvent = 'Event:DataFrame';

export type DataFrameEventPayload = {
  kline: Kline;
  indicators: Indicators;
  signal: Signal;
};

export type Indicators = {
  adx: number;
  rsi: number;
  macd: number;
  macd_signal: number;
  macd_hist: number;
};

export type Signal = {
  buy: boolean;
  sell: boolean;
};
