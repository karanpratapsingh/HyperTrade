import create, { SetState, GetState } from 'zustand';
import { DataFrameEventPayload } from '../events';

type DataFrameStore = {
  data: DataFrameEventPayload[];
  add(kline: DataFrameEventPayload): void;
};

const MAX_INTERVALS = 40;

export const useDataFrame = create<DataFrameStore>(
  (set: SetState<DataFrameStore>, get: GetState<DataFrameStore>) => ({
    data: [],
    add: (frame: DataFrameEventPayload) => {
      const { data } = get();

      const update = [...data, frame];

      if (update.length > MAX_INTERVALS) {
        update.shift();
      }

      set({ data: update });
    },
  })
);
