import create, { GetState, SetState } from 'zustand';
import { getDataFrame } from '../api/dataframe';
import { DataFrameEventPayload } from '../events/types';
import * as Notifications from '../utils/notifications';

type DataFrameStore = {
  data: DataFrameEventPayload[];
  loading: boolean;
  restore(): Promise<void>;
  add(frames: DataFrameEventPayload[]): void;
};

const MAX_INTERVALS = 120;

export const useDataFrame = create<DataFrameStore>(
  (set: SetState<DataFrameStore>, get: GetState<DataFrameStore>) => ({
    data: [],
    loading: true,
    restore: async (): Promise<void> => {
      try {
        const { dataframe } = await getDataFrame(MAX_INTERVALS);
        set({ data: dataframe });
      } catch (err) {
        Notifications.error('GetDataFrame', err);
      } finally {
        set({ loading: false });
      }
    },
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
