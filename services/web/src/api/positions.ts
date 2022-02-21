import { useQuery } from 'react-query';
import { PubSub } from '../events/pubsub';
import { Events } from '../events/types';
import { ApiQueryResult, options } from './types';

export type Position = {
  symbol: string;
  price: number;
  quantity: number;
  time: Date;
};

export type GetPositionsResponse = {
  positions: Position[];
};

export async function getPositions(): Promise<GetPositionsResponse> {
  const pubsub = await PubSub.getInstance();
  return await pubsub.request<GetPositionsResponse>(Events.GetPositions);
}

export function usePositions(): ApiQueryResult<GetPositionsResponse> {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery<GetPositionsResponse, Error>('positions', getPositions, options);

  return { data, loading, error };
}
