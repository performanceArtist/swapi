import React from 'react';
import { CharacterInfoContainer } from '../features/CharacterInfo';
import { useParams } from 'react-router-dom';
import { Layout } from './Layout';

export const CharacterInfoPage = () => {
  const { id } = useParams();

  const vid = Number(id);

  if (Number.isNaN(vid)) {
    return <div>Invalid character id</div>;
  }

  return (
    <Layout>
      <CharacterInfoContainer id={vid} />
    </Layout>
  );
};
