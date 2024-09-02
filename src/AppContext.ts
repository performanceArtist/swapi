import { createContext } from 'react';
import { SWApi } from './api/SWApi';

export type AppContext = {
  SWApi: SWApi;
};

export const AppContext = createContext(null as any as AppContext);
