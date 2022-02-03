import axios, { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
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

export function useTrades(): ApiHookResult<TradesResponse> {
  const fetch = () => axios.get('/exchange/trades');
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery<AxiosResponse<TradesResponse, Error>, Error>('trades', fetch, {
    refetchInterval: 4 * 1000,
  });

  return { data: data?.data, loading, error };
}
