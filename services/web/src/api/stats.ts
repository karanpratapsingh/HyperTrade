import axios, { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import { ApiHookResult } from './types';

export type Stats = {
  profit: number;
  loss: number;
  total: number;
};

export type StatsResponse = {
  stats: Stats | null;
};

export function useStats(symbol: string): ApiHookResult<StatsResponse> {
  const fetch = () => axios.get(`/exchange/stats?symbol=${symbol}`);
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery<AxiosResponse<StatsResponse, Error>, Error>('stats', fetch, {
    refetchInterval: 4 * 1000,
  });

  return { data: data?.data, loading, error };
}
