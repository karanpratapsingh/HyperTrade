import { useMutation, useQuery, useQueryClient } from 'react-query';
import { PubSub } from '../events/pubsub';
import { Events } from '../events/types';
import { ApiMutationResult, ApiQueryResult } from './types';

export type Configs = {
  symbol: string;
  base: string;
  quote: string;
  minimum: number;
  allowed_amount: number;
  trading_enabled: boolean;
};

export type GetConfigsResponse = {
  configs: Configs[];
};

export async function getConfigs(): Promise<GetConfigsResponse> {
  const pubsub = await PubSub.getInstance();
  return await pubsub.request<GetConfigsResponse>(Events.GetConfigs);
}

export function useConfigs(): ApiQueryResult<GetConfigsResponse> {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery<GetConfigsResponse, Error>('configs', getConfigs);

  return { data, loading, error };
}

export type UpdateTradingEnabledRequest = {
  symbol: string;
  enabled: boolean;
};

export async function updateTradingEnabled(
  data: UpdateTradingEnabledRequest
): Promise<unknown> {
  const pubsub = await PubSub.getInstance();
  return await pubsub.request(Events.UpdateTradingEnabled, data);
}

export function useUpdateTradingEnabled(): ApiMutationResult<
  unknown,
  UpdateTradingEnabledRequest
> {
  const client = useQueryClient();
  const {
    mutate,
    data,
    isLoading: loading,
  } = useMutation('update-trading-enabled', updateTradingEnabled, {
    onSuccess: () => client.refetchQueries('configs'),
  });

  return { mutate, data, loading };
}

export type UpdateAllowedAmountRequest = {
  symbol: string;
  amount: number;
};

export async function updateAllowedAmount(
  data: UpdateAllowedAmountRequest
): Promise<unknown> {
  const pubsub = await PubSub.getInstance();
  return await pubsub.request(Events.UpdateAllowedAmount, data);
}

export function useUpdateAllowedAmount(): ApiMutationResult<
  unknown,
  UpdateAllowedAmountRequest
> {
  const client = useQueryClient();
  const {
    mutate,
    data,
    isLoading: loading,
  } = useMutation('update-allowed-amount', updateAllowedAmount, {
    onSuccess: () => client.refetchQueries('configs'),
  });

  return { mutate, data, loading };
}
