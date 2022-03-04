import create, { GetState, SetState } from 'zustand';
import { getConfigs } from '../api/configs';

type SymbolStore = {
  symbol: string | null;
  loading: boolean;
  setDefault: () => Promise<void>;
  getSymbol: () => string;
  setSymbol: (symbol: string) => void;
};

export const useSymbolStore = create<SymbolStore>(
  (set: SetState<SymbolStore>, get: GetState<SymbolStore>) => ({
    symbol: null,
    loading: true,
    setDefault: async (): Promise<void> => {
      const { configs } = await getConfigs();
      const [{ symbol }] = configs;
      set({ loading: false, symbol });
    },
    getSymbol: (): string => {
      const { symbol } = get();

      if (!symbol) {
        throw new Error('SymbolStore: Symbol is null');
      }

      return symbol;
    },
    setSymbol: (symbol: string): void => {
      set({ symbol });
    },
  })
);
