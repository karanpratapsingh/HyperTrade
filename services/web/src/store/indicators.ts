import create, { SetState } from 'zustand';
import { Indicators, TechnicalIndicators } from '../config/indicators';

type IndicatorsStore = {
  primary: TechnicalIndicators[];
  secondary: TechnicalIndicators[];
  setPrimary(indicators: TechnicalIndicators[]): void;
  setSecondary(indicators: TechnicalIndicators[]): void;
};

export const useIndicatorsStore = create<IndicatorsStore>(
  (set: SetState<IndicatorsStore>) => ({
    primary: [],
    secondary: [Indicators.VOL],
    setPrimary: (primary: TechnicalIndicators[]): void => {
      set({ primary });
    },
    setSecondary: (secondary: TechnicalIndicators[]): void => {
      set({ secondary });
    },
  })
);
