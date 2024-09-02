import { useState } from 'react';
import { remoteData, RemoteData } from '../functional';

export const usePromiseRD = <E, A, T extends any[]>(
  worker: (...args: T) => Promise<RemoteData<E, A>>,
): [RemoteData<E, A>, (...args: T) => void] => {
  const [rd, setRD] = useState(remoteData.initial as RemoteData<E, A>);

  return [
    rd,
    (...args: T) => {
      setRD(remoteData.pending);
      worker(...args).then(setRD);
    },
  ];
};
