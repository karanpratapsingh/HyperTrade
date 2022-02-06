import { PubSub } from '../events/pubsub';
import { DataFrameEventPayload, Events } from '../events/types';

type DataFrameRequest = {
  size: number;
};

type DataFrameResponse = {
  dataframe: DataFrameEventPayload[];
};

export async function getDataFrame(size: number): Promise<DataFrameResponse> {
  const pubsub = await PubSub.getInstance();

  return await pubsub.request<DataFrameResponse, DataFrameRequest>(
    Events.GetDataFrame,
    { size }
  );
}
