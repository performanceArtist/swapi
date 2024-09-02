import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: fit-content;
  border: solid 2px grey;
  border-radius: 8px;
  padding: 12px;
`;

export const CharacterFieldsTitle = styled.div`
  padding-left: 15px;
`;

export const CharacterFieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CharacterFields = styled.div`
  display: flex;
  padding: 15px;
  gap: 18px;
`;

export const FilmFields = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  column-gap: 8px;
  row-gap: 15px;
  margin-top: 6px;
`;

export const FilmField = styled.div`
  display: flex;
  align-items: center;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
`;
