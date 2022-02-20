import { UseMutateFunction } from 'react-query';

export const options = {
  refetchInterval: 5 * 1000,
};

export interface ApiQueryResult<T, E = Error> {
  data: T | undefined;
  loading: boolean;
  error: E | null;
}

export interface ApiMutationResult<T, V, E = unknown> {
  mutate: UseMutateFunction<T, E, V>;
  data: T | undefined;
  loading: boolean;
}
