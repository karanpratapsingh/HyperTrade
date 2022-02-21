import { useQuery } from 'react-query';
import { PubSub } from '../events/pubsub';
import { Events } from '../events/types';
import { ApiQueryResult, options } from './types';

export type Balance = {
  asset: string;
  amount: number;
};

export type GetBalanceResponse = {
  test: boolean;
  balance: Balance[];
};

export async function getBalance(): Promise<GetBalanceResponse> {
  const pubsub = await PubSub.getInstance();
  return await pubsub.request<GetBalanceResponse>(Events.GetBalance);
}

export function useBalance(): ApiQueryResult<GetBalanceResponse> {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery<GetBalanceResponse, Error>('balance', getBalance, options);

  return { data, loading, error };
}
