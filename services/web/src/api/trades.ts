import { Result } from './types';
import axios, { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';

export type Trade = {
  id: number;
  symbol: string;
  entry: number;
  exit: number;
  quantity: number;
  time: Date;
};

type TradesResponse = {
  trades: Trade[];
};

export function useTrades(): Result<TradesResponse> {
  const fetch = () => axios.get('/exchange/trades');
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery<AxiosResponse<TradesResponse, Error>, Error>('trades', fetch);

  return { data: data?.data, loading, error };
}
