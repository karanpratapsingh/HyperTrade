import axios, { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import { ApiHookResult } from './types';

export type Balance = {
  asset: string;
  amount: number;
};

export type BalanceResponse = {
  test: boolean;
  balance: Balance[];
};

export function useBalance(): ApiHookResult<BalanceResponse> {
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
