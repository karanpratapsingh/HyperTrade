import { useMutation, useQuery } from 'react-query';
import { PubSub } from '../events/pubsub';
import { Events } from '../events/types';
import { ApiMutationResult, ApiQueryResult } from './types';

export type Rsi = {
  enabled: boolean;
  oversold: number;
  overbought: number;
};

export type Strategies = {
  symbol: string;
  rsi: Rsi;
};

export type GetStrategyRequest = {
  symbol: string;
};

export type GetStrategyResponse = {
  strategy: Strategies;
};

export async function getStrategy(
  data: GetStrategyRequest
): Promise<GetStrategyResponse> {
  const pubsub = await PubSub.getInstance();
  return await pubsub.request<GetStrategyResponse>(Events.GetStrategies, data);
}

export function useStrategy(
  symbol: Strategies['symbol']
): ApiQueryResult<GetStrategyResponse> {
  const key = 'strategies';

  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<GetStrategyResponse, Error>(key, () => getStrategy({ symbol }));

  return { data, loading, error, refetch };
}

export type UpdateStrategyRequest = {
  strategy: Strategies;
};

export async function updateStrategy(
  data: UpdateStrategyRequest
): Promise<boolean> {
  const pubsub = await PubSub.getInstance();
  return await pubsub.request(Events.UpdateStrategies, data);
}

export function useUpdateStrategy(): ApiMutationResult<
  unknown,
  UpdateStrategyRequest
> {
  const {
    mutate,
    data,
    isLoading: loading,
  } = useMutation('update-strategy', updateStrategy);

  return { mutate, data, loading };
}
