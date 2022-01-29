import create, { SetState, GetState } from 'zustand';
import { Kline } from '../events';

type KlineStore = {
  data: Kline[];
  add(kline: Kline): void;
};

export const useKline = create<KlineStore>(
  (set: SetState<KlineStore>, get: GetState<KlineStore>) => ({
    data: [],
    add: (kline: Kline) => {
      const { data } = get();

      const update = [...data, kline];

      set({ data: update });
    },
  })
);
