import { TechnicalIndicator } from 'klinecharts';

export interface TechnicalIndicators extends TechnicalIndicator {
  description: string;
}

export const Indicators: Record<string, TechnicalIndicators> = {
  RSI: {
    name: 'RSI',
    description: 'Relative Strength Index',
    calcParams: [14],
  },
  MACD: { name: 'MACD', description: 'Moving Average Convergence Divergence' },
  VOL: { name: 'VOL', description: 'Volume' },
  MA: { name: 'MA', description: 'Moving Average' },
  EMA: { name: 'EMA', description: 'Exponential Moving Average' },
  SMA: { name: 'SMA', description: 'Simple Moving Average' },
  BOLL: { name: 'BOLL', description: 'Bollinger Bands' },
  SAR: { name: 'SAR', description: 'Stop and Reverse' },
  BBI: { name: 'BBI', description: 'Bull and Bear Index' },
  KDJ: { name: 'KDJ', description: 'KDJ Index' },
  OBV: { name: 'OBV', description: 'On Balance Volume' },
};

export const PrimaryIndicators: TechnicalIndicators[] = [
  Indicators.MA,
  Indicators.EMA,
  Indicators.SMA,
  Indicators.BOLL,
  Indicators.SAR,
  Indicators.BBI,
];

export const SecondaryIndicators = Object.values(Indicators);
