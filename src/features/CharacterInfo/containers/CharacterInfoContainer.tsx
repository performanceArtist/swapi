import React from 'react';
import { CharacterInfoLoader } from '../components/CharacterInfo';
import { useCharacterInfoModel } from '../model/state';

export type CharacterInfoContainerProps = {
  id: number;
};

export const CharacterInfoContainer = (props: CharacterInfoContainerProps) => {
  const { id } = props;
  const { characterInfo, saveCharacterInfo } = useCharacterInfoModel({
    id,
  });

  return (
    <CharacterInfoLoader
      characterInfo={characterInfo}
      onCharacterInfoSave={saveCharacterInfo}
    />
  );
};
