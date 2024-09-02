import React from 'react';
import { makeSWApi } from './api/SWApi';
import { App } from './App';
import { AppContext } from './AppContext';

export const AppContainer = () => {
  const appContext: AppContext = {
    SWApi: makeSWApi({
      baseURL: 'https://swapi.dev',
      logs: process.env['ENV'] === 'development',
    }),
  };

  return <App appContext={appContext} />;
};
