import filter from 'lodash/filter';
import create, { GetState, SetState } from 'zustand';
import { getDataFrame } from '../api/dataframe';
import { DataFrameEventPayload } from '../events/types';
import * as Notifications from '../utils/notifications';

type DataFrameStore = {
  data: DataFrameEventPayload[];
  loading: boolean;
  restore(): Promise<void>;
  add: (frames: DataFrameEventPayload[]) => void;
  get: (symbol: string) => DataFrameEventPayload[];
};

const MAX_INTERVALS = 400;

export const useDataFrameStore = create<DataFrameStore>(
  (set: SetState<DataFrameStore>, get: GetState<DataFrameStore>) => ({
    data: [],
    loading: true,
    restore: async (): Promise<void> => {
      try {
        const { dataframe } = await getDataFrame(MAX_INTERVALS);
        set({ data: dataframe });
      } catch (err) {
        Notifications.error('Get dataframe', err);
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
    get: (symbol: string): DataFrameEventPayload[] => {
      const { data } = get();

      function predicate(payload: DataFrameEventPayload): boolean {
        return symbol === payload.kline.symbol;
      }

      return filter(data, predicate);
    },
  })
);
