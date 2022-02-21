import { useQuery } from 'react-query';
import { PubSub } from '../events/pubsub';
import { Events } from '../events/types';
import { ApiQueryResult, options } from './types';

export type Stats = {
  profit: number;
  loss: number;
  total: number;
};

export type GetStatsRequest = {
  symbol: string;
};

export type GetStatsResponse = {
  stats: Stats | null;
};

export async function getStats(symbol: string): Promise<GetStatsResponse> {
  const pubsub = await PubSub.getInstance();
  return await pubsub.request<GetStatsResponse, GetStatsRequest>(
    Events.GetStats,
    {
      symbol,
    }
  );
}

export function useStats(symbol: string): ApiQueryResult<GetStatsResponse> {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery<GetStatsResponse, Error>(
    'stats',
    () => getStats(symbol),
    options
  );

  return { data, loading, error };
}
