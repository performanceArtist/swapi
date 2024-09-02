import { RemoteData } from '../functional';
import React, { ComponentType, memo } from 'react';

type RemoteDataRendererProps<E, T> = {
  data: RemoteData<E, T>;
  onInitial: () => JSX.Element;
  onSuccess: (result: T) => JSX.Element;
  onPending: () => JSX.Element;
  onError: (error: E) => JSX.Element;
};

const memoId = memo as <E extends ComponentType<any>>(e: E) => E;

export const RemoteDataRenderer = memoId(function <E, T>(
  props: RemoteDataRendererProps<E, T>,
) {
  const { data, onSuccess, onError, onPending, onInitial } = props;

  switch (data.type) {
    case 'initial':
      return onInitial();
    case 'pending':
      return onPending();
    case 'error':
      return onError(data.error);
    case 'success':
      return onSuccess(data.data);
  }
});

export type Defaults<E, A> = Pick<
  RemoteDataRendererProps<E, A>,
  'onError' | 'onInitial' | 'onPending'
>;

export type WithDefaults<E, A> = Partial<Defaults<E, A>> &
  Pick<RemoteDataRendererProps<E, A>, 'data' | 'onSuccess'>;

export const makeRemoteDataDefault = function <E>(
  defaults: Defaults<E, unknown>,
) {
  return memoId(function <A>(props: WithDefaults<E, A>) {
    const { onError, onPending, onInitial, onSuccess, data } = props;

    return (
      <RemoteDataRenderer
        onError={onError || defaults.onError}
        onPending={onPending || defaults.onPending}
        onInitial={onInitial || defaults.onInitial}
        onSuccess={onSuccess}
        data={data}
      />
    );
  });
};
