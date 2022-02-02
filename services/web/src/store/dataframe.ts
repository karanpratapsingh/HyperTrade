import create, { GetState, SetState } from 'zustand';
import { DataFrameEventPayload } from '../events/types';

type DataFrameStore = {
  data: DataFrameEventPayload[];
  add(frames: DataFrameEventPayload[]): void;
};

const MAX_INTERVALS = 120;

export const useDataFrame = create<DataFrameStore>(
  (set: SetState<DataFrameStore>, get: GetState<DataFrameStore>) => ({
    data: [],
    add: (frames: DataFrameEventPayload[]): void => {
      const { data } = get();

      const update = [...data, ...frames];

      if (update.length > MAX_INTERVALS) {
        update.shift();
      }

      set({ data: update });
    },
  })
);
