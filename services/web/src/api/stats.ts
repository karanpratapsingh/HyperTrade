import { useQuery } from 'react-query';
import { PubSub } from '../events/pubsub';
import { Events } from '../events/types';
import { ApiQueryResult, options } from './types';

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

export async function getStats(symbol: string): Promise<StatsResponse> {
  const pubsub = await PubSub.getInstance();
  return await pubsub.request<StatsResponse, StatsRequest>(Events.GetStats, {
    symbol,
  });
}

export function useStats(symbol: string): ApiQueryResult<StatsResponse> {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery<StatsResponse, Error>('stats', () => getStats(symbol), options);

  return { data, loading, error };
}
