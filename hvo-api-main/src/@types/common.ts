export type OptionalKeys<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type RequiredKeys<T, K extends keyof T> = Partial<Omit<T, K>> &
  Required<Pick<T, K>>;
