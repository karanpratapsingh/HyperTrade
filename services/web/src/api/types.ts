export const options = {
  refetchInterval: 5 * 1000,
};

export interface ApiHookResult<T, E = Error> {
  data: T | undefined;
  loading: boolean;
  error: E | null;
}
