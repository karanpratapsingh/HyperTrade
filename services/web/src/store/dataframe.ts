import create, { GetState, SetState } from 'zustand';
import { DataFrameEventPayload } from '../events/types';

type DataFrameStore = {
  data: DataFrameEventPayload[];
  add(kline: DataFrameEventPayload[]): void;
};

const MAX_INTERVALS = 120;

export const useDataFrame = create<DataFrameStore>(
  (set: SetState<DataFrameStore>, get: GetState<DataFrameStore>) => ({
    data: [],
    add: (frame: DataFrameEventPayload[]) => {
      const { data } = get();

      const update = [...data, ...frame];

      if (update.length > MAX_INTERVALS) {
        update.shift();
      }

      set({ data: update });
    },
  })
);
