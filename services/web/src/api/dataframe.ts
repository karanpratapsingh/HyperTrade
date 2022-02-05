import axios from 'axios';
import { DataFrameEventPayload } from '../events/types';
import * as Notifications from '../utils/notifications';

type DataFrameResponse = {
  dataframe: DataFrameEventPayload[];
};

export async function getDataFrame(size: number): Promise<DataFrameResponse> {
  const { data, status, statusText } = await axios.get(
    `/exchange/dataframe?size=${size}`
  );

  if (status !== 200) {
    Notifications.error(statusText);
  }

  return data;
}
