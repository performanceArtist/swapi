import { flow } from './flow';
import { pipe } from './pipe';

export type Pending = {
  type: 'pending';
};
const pending: Pending = {
  type: 'pending',
};

export type Initial = {
  type: 'initial';
};
const initial: Initial = {
  type: 'initial',
};

export type RemoteDataError<E> = {
  type: 'error';
  error: E;
};

export type Success<T> = {
  type: 'success';
  data: T;
};

export type RemoteData<E, T> =
  | Success<T>
  | RemoteDataError<E>
  | Pending
  | Initial;

const map =
  <A, B>(f: (a: A) => B) =>
  <E>(d: RemoteData<E, A>): RemoteData<E, B> =>
    d.type === 'success' ? { type: 'success', data: f(d.data) } : d;

const mapLeft =
  <E, B>(f: (a: E) => B) =>
  <T>(d: RemoteData<E, T>): RemoteData<B, T> =>
    d.type === 'error' ? { type: 'error', error: f(d.error) } : d;

const ap = <E, A, B>(
  fb: RemoteData<E, (a: A) => B>,
  fa: RemoteData<E, A>,
): RemoteData<E, B> =>
  fb.type === 'success' && fa.type === 'success'
    ? remoteData.makeSuccess(fb.data(fa.data))
    : fb.type === 'success'
      ? (fa as RemoteData<E, B>)
      : fb;

export type RemoteDataValue<T> = T extends RemoteData<any, infer V> ? V : never;

const combine = <T extends RemoteData<any, any>[]>(...rds: T) =>
  rds.reduce((acc, cur) => {
    const concat = pipe(
      cur,
      map((next) => (rest: unknown[]) => [...rest, next]),
    );

    return ap(concat, acc) as any;
  }, remoteData.makeSuccess<any, unknown[]>([])) as any as RemoteData<
    T[number] extends RemoteData<infer E, any> ? E : never,
    {
      [key in keyof T]: T[key] extends RemoteData<any, infer V> ? V : never;
    }
  >;

const chain =
  <A, B, NE>(f: (a: A) => RemoteData<NE, B>) =>
  <E>(d: RemoteData<E, A>): RemoteData<NE | E, B> =>
    d.type === 'success' ? f(d.data) : d;

const fold =
  <E, T, A>(
    onInitial: () => A,
    onPending: () => A,
    onError: (e: E) => A,
    onSuccess: (data: T) => A,
  ) =>
  (rd: RemoteData<E, T>): A => {
    switch (rd.type) {
      case 'initial':
        return onInitial();
      case 'pending':
        return onPending();
      case 'error':
        return onError(rd.error);
      case 'success':
        return onSuccess(rd.data);
    }
  };

const getOrElse =
  <A>(def: A) =>
  <E>(rd: RemoteData<E, A>): A =>
    rd.type === 'success' ? rd.data : def;

const exists =
  <A>(predicate: (value: A) => boolean) =>
  <E>(rd: RemoteData<E, A>) =>
    rd.type === 'success' && predicate(rd.data);

const fromPromise =
  <E>(toError: (input: unknown) => E) =>
  <A>(p: Promise<A>) =>
    p
      .then(remoteData.makeSuccess)
      .catch(flow(toError, remoteData.makeError)) as Promise<RemoteData<E, A>>;

const fromLazyPromise =
  <E>(toError: (input: unknown) => E) =>
  <A, I = void>(p: (input: I) => Promise<A>) =>
    flow(p, fromPromise(toError));

const chainPromise =
  <E, A, B>(f: (a: A) => Promise<RemoteData<E, B>>) =>
  (p: Promise<RemoteData<E, A>>) =>
    p.then((res) => (res.type === 'success' ? f(res.data) : res));

export const remoteData = {
  initial,
  pending,
  makeError: <E, T>(error: E): RemoteData<E, T> => ({ type: 'error', error }),
  makeSuccess: <E, T>(data: T): RemoteData<E, T> => ({ type: 'success', data }),
  map,
  mapLeft,
  combine,
  chain,
  fromPromise,
  fromLazyPromise,
  chainPromise,
  fold,
  getOrElse,
  exists,
};
