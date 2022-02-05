import { useQuery } from 'react-query';
import { PubSub } from '../events/pubsub';
import { Events } from '../events/types';
import { ApiHookResult, options } from './types';

export type Balance = {
  asset: string;
  amount: number;
};

export type BalanceResponse = {
  test: boolean;
  balance: Balance[];
};

export const getBalance = async () => {
  const pubsub = await PubSub.getInstance();
  return await pubsub.request<BalanceResponse>(Events.GetBalance);
};

export function useBalance(): ApiHookResult<BalanceResponse> {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery<BalanceResponse, Error>('balance', getBalance, options);

  return { data, loading, error };
}
