import { useQuery } from 'react-query';
import { PubSub } from '../events/pubsub';
import { Events } from '../events/types';
import { ApiQueryResult, options } from './types';

export type Trade = {
  id: number;
  symbol: string;
  entry: number;
  exit: number;
  quantity: number;
  time: Date;
};

export type GetTradesResponse = {
  trades: Trade[];
};

export async function getPositions(): Promise<GetTradesResponse> {
  const pubsub = await PubSub.getInstance();
  return await pubsub.request<GetTradesResponse>(Events.GetTrades);
}

export function useTrades(): ApiQueryResult<GetTradesResponse> {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery<GetTradesResponse, Error>('trades', getPositions, options);

  return { data, loading, error };
}
