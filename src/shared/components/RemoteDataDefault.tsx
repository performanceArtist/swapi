import { ClientError } from '../types';
import { makeRemoteDataDefault } from './RemoteDataRenderer';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';

const getErrorMessage = (e: ClientError): string => {
  switch (e.type) {
    case 'networkError':
      return e.error.cause?.message || 'Network error';
    case 'validationError':
      return e.error.message;
  }
};

export const RemoteDataDefault = makeRemoteDataDefault<ClientError>({
  onError: (error) => <h2>{getErrorMessage(error)}</h2>,
  onPending: () => <CircularProgress />,
  onInitial: () => <CircularProgress />,
});
