import React from 'react';
import { CharacterList } from '../components/CharacterList';
import { useNavigate } from 'react-router-dom';
import { useCharacterListModel } from '../model/state';

export const CharacterListContainer = () => {
  const { data, pageNumber, setPageNumber, search, setSearch } =
    useCharacterListModel();

  const navigate = useNavigate();

  return (
    <CharacterList
      data={data}
      pageNumber={pageNumber}
      onPageChange={setPageNumber}
      search={search}
      onSearchChange={setSearch}
      onCharacterClick={(id) => navigate(`/character/${id}`)}
    />
  );
};
