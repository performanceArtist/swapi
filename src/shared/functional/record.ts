import { pipe } from './pipe';

const reduce =
  <Acc, A, K extends PropertyKey>(
    initial: Acc,
    f: (acc: Acc, cur: A, key: K) => Acc,
  ) =>
  (r: Record<K, A>) =>
    Object.entries<A>(r).reduce(
      (acc, [key, value]) => f(acc, value, key as K),
      initial,
    );

const map = <A, B, K extends PropertyKey>(f: (a: A, key: K) => B) =>
  reduce<Record<K, B>, A, K>({} as Record<K, B>, (acc, cur, key) => ({
    ...acc,
    [key]: f(cur, key),
  }));

export type MaybeRecord<T> = {
  [key in keyof T]: T[key] | null;
};

const toPartial = <T extends MaybeRecord<any>>(
  r: T,
): Partial<{ [key in keyof T]: Exclude<T[key], null> }> =>
  pipe(
    r,
    map((value) => (value === null ? undefined : value)),
  );

export const record = {
  reduce,
  map,
  toPartial,
};
