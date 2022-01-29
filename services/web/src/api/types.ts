export type Result<T, E = Error> = {
  data: T | undefined;
  loading: boolean;
  error: E | null;
};
