export const options = {
  refetchInterval: 5 * 1000,
};

export interface ApiQueryResult<T, E = Error> {
  data: T | undefined;
  loading: boolean;
  error: E | null;
}
