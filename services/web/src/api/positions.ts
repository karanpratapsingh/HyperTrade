import { useQuery } from 'react-query';
import { PubSub } from '../events/pubsub';
import { Events } from '../events/types';
import { ApiHookResult } from './types';

export type Position = {
  Symbol: string;
  Price: number;
  Quantity: number;
  time: Date;
};

export type PositionsResponse = {
  positions: Position[];
};

export const getPositions = async () => {
  const pubsub = await PubSub.getInstance();
  return await pubsub.request<PositionsResponse>(Events.GetPositions);
};

export function usePositions(): ApiHookResult<PositionsResponse> {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery<PositionsResponse, Error>('positions', getPositions, {
    refetchInterval: 4 * 1000,
  });

  return { data, loading, error };
}
