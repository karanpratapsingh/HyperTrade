import { PubSub } from '../events/pubsub';
import { DataFrameEventPayload, Events } from '../events/types';

type GetDataFrameRequest = {
  size: number;
};

type GetDataFrameResponse = {
  dataframe: DataFrameEventPayload[];
};

export async function getDataFrame(size: number): Promise<GetDataFrameResponse> {
  const pubsub = await PubSub.getInstance();

  return await pubsub.request<GetDataFrameResponse, GetDataFrameRequest>(
    Events.GetDataFrame,
    { size }
  );
}
