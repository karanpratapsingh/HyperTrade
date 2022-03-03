import create, { SetState } from 'zustand';
import Env from '../utils/env';

type SymbolStore = {
  symbol: string;
  setSymbol: (symbol: string) => void;
};

export const useSymbolStore = create<SymbolStore>(
  (set: SetState<SymbolStore>) => ({
    symbol: Env.SYMBOL,
    setSymbol: (symbol: string): void => {
      set({ symbol });
    },
  })
);
