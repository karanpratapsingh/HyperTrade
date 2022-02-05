import { useQuery } from 'react-query';
import { PubSub } from '../events/pubsub';
import { Events } from '../events/types';
import { ApiHookResult } from './types';

export type Stats = {
  profit: number;
  loss: number;
  total: number;
};

export type StatsRequest = {
  symbol: string;
};

export type StatsResponse = {
  stats: Stats | null;
};

export const getStats = async (symbol: string) => {
  const pubsub = await PubSub.getInstance();
  return await pubsub.request<StatsResponse, StatsRequest>(Events.GetStats, {
    symbol,
  });
};

export function useStats(symbol: string): ApiHookResult<StatsResponse> {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery<StatsResponse, Error>('stats', () => getStats(symbol), {
    refetchInterval: 4 * 1000,
  });

  return { data, loading, error };
}
