import axios, { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import { Result } from './types';

export type Balance = {
  asset: string;
  amount: number;
};

type BalanceResponse = {
  balance: Balance[];
};

export function useBalance(): Result<BalanceResponse> {
  const fetch = () => axios.get('/exchange/balance');
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery<AxiosResponse<BalanceResponse, Error>, Error>('balance', fetch, {
    refetchInterval: 4 * 1000,
  });

  return { data: data?.data, loading, error };
}
