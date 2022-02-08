import { useQuery } from 'react-query';
import { PubSub } from '../events/pubsub';
import { Events } from '../events/types';
import { ApiHookResult, options } from './types';

export type Position = {
  symbol: string;
  price: number;
  quantity: number;
  time: Date;
};

export type PositionsResponse = {
  positions: Position[];
};

export async function getPositions(): Promise<PositionsResponse> {
  const pubsub = await PubSub.getInstance();
  return await pubsub.request<PositionsResponse>(Events.GetPositions);
}

export function usePositions(): ApiHookResult<PositionsResponse> {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery<PositionsResponse, Error>('positions', getPositions, options);

  return { data, loading, error };
}
