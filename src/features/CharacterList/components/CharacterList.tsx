import React from 'react';
import { RemoteData } from '../../../shared/functional';
import { ClientError } from '../../../shared/types/error';
import { RemoteDataDefault } from '../../../shared/components/RemoteDataDefault';
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import { Character } from '../../../shared/types';
import { getURLId } from '../../../shared/utils';
import Link from '@mui/material/Link';
import * as Styled from './CharacterList.styled';

export type CharacterListProps = {
  data: RemoteData<
    ClientError,
    {
      characters: Character[];
      pageCount: number;
    }
  >;
  pageNumber: number;
  onPageChange: (pageNumber: number) => void;
  search: string;
  onSearchChange: (search: string) => void;
  onCharacterClick: (id: number) => void;
};

export const CharacterList = (props: CharacterListProps) => {
  const {
    data,
    pageNumber,
    onPageChange,
    search,
    onSearchChange,
    onCharacterClick,
  } = props;

  return (
    <Styled.Container>
      <Styled.SearchContainer>
        <TextField
          size="small"
          placeholder="Search by name"
          onChange={(e) => onSearchChange(e.target.value)}
          value={search}
        />
      </Styled.SearchContainer>
      <RemoteDataDefault
        data={data}
        onSuccess={({ characters, pageCount }) =>
          characters.length === 0 ? (
            <div>No characters found</div>
          ) : (
            <Styled.CharacterList>
              {characters
                .reduce(
                  (acc, cur) => {
                    const id = getURLId(cur.url);
                    return id === null
                      ? acc
                      : acc.concat({ id, character: cur });
                  },
                  [] as { character: Character; id: number }[],
                )
                .map(({ character, id }) => (
                  <Styled.CharacterLinkContainer key={id}>
                    <Link
                      onClick={() => onCharacterClick(id)}
                      style={{ cursor: 'pointer ' }}
                    >
                      {character.name}
                    </Link>
                  </Styled.CharacterLinkContainer>
                ))}
              <Styled.Footer>
                <Pagination
                  count={pageCount}
                  page={pageNumber}
                  onChange={(_, value) => onPageChange(value)}
                />
              </Styled.Footer>
            </Styled.CharacterList>
          )
        }
      />
    </Styled.Container>
  );
};
