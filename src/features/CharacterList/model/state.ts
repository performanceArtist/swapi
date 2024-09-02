import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../../../AppContext';
import { usePromiseRD } from '../../../shared/hooks/usePromise';
import debouncePromise from 'debounce-promise';
import { pipe, remoteData } from '../../../shared/functional';
import { CharacterListProps } from '../components/CharacterList';

const PAGE_SIZE = 10;

export const useCharacterListModel = () => {
  const { SWApi } = useContext(AppContext);

  const [pageNumber, setPageNumber] = useState(1);
  const [search, setSearch] = useState('');

  const requestStatus = useRef<'page' | 'search'>('page');
  useEffect(() => {
    requestStatus.current = 'page';
  }, [pageNumber]);
  useEffect(() => {
    requestStatus.current = 'search';
  }, [search]);

  const getPeople = debouncePromise(SWApi.getPeople, 300, { leading: true });

  const [getCharactersResponse, getCharacters] = usePromiseRD(getPeople);

  useEffect(() => {
    if (requestStatus.current === 'search' && pageNumber !== 1) {
      setPageNumber(1);
    } else {
      getCharacters({ page: pageNumber, nameSearch: search });
    }
  }, [pageNumber, search]);

  const data: CharacterListProps['data'] = pipe(
    getCharactersResponse,
    remoteData.map(({ results, count }) => ({
      characters: results,
      pageCount: Math.round(count / PAGE_SIZE - 0.5) + 1,
    })),
  );

  return {
    data,
    pageNumber,
    setPageNumber,
    search,
    setSearch,
  };
};
