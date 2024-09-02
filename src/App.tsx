import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { CharacterListPage } from './pages/CharacterListPage';
import { CharacterInfoPage } from './pages/CharacterInfoPage';
import { AppContext } from './AppContext';

export type AppProps = {
  appContext: AppContext;
};

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <CharacterListPage />,
      errorElement: <div>Something went wrong</div>,
    },
    {
      path: 'character/:id',
      element: <CharacterInfoPage />,
    },
  ],
  {
    basename: process.env['ENV'] === 'development' ? '' : '/swapi',
  },
);

export const App = (props: AppProps) => {
  const { appContext } = props;

  return (
    <AppContext.Provider value={appContext}>
      <RouterProvider router={router} />
    </AppContext.Provider>
  );
};
