import { useQuery } from 'react-query';
import { PubSub } from '../events/pubsub';
import { Events } from '../events/types';
import { ApiHookResult } from './types';

export type Trade = {
  id: number;
  symbol: string;
  entry: number;
  exit: number;
  quantity: number;
  time: Date;
};

export type TradesResponse = {
  trades: Trade[];
};

export const getPositions = async () => {
  const pubsub = await PubSub.getInstance();
  return await pubsub.request<TradesResponse>(Events.GetTrades);
};

export function useTrades(): ApiHookResult<TradesResponse> {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery<TradesResponse, Error>('trades', getPositions, {
    refetchInterval: 4 * 1000,
  });

  return { data, loading, error };
}
