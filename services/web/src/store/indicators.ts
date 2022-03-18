import create, { SetState } from 'zustand';
import { AxisType, ChartType } from '../components/charts/kline';
import { Indicators, TechnicalIndicators } from '../config/indicators';

type IndicatorsStore = {
  type: ChartType;
  axis: AxisType;
  primary: TechnicalIndicators[];
  secondary: TechnicalIndicators[];
  setPrimary(indicators: TechnicalIndicators[]): void;
  setSecondary(indicators: TechnicalIndicators[]): void;
  setType(type: ChartType): void;
  setAxis(type: AxisType): void;
};

export const useIndicatorsStore = create<IndicatorsStore>(
  (set: SetState<IndicatorsStore>) => ({
    type: ChartType.AREA,
    axis: AxisType.NORMAL,
    primary: [],
    secondary: [Indicators.RSI, Indicators.MACD],
    setPrimary: (primary: TechnicalIndicators[]): void => {
      set({ primary });
    },
    setSecondary: (secondary: TechnicalIndicators[]): void => {
      set({ secondary });
    },
    setType: (type: ChartType): void => {
      set({ type });
    },
    setAxis: (axis: AxisType): void => {
      set({ axis });
    },
  })
);
