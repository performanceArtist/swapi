import React from 'react';
import { CharacterInfo } from '../../../shared/types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { RemoteData } from '../../../shared/functional';
import { ClientError } from '../../../shared/types';
import { RemoteDataDefault } from '../../../shared/components/RemoteDataDefault';
import { FieldPath, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getMuiError } from '../../../shared/utils';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import * as Styled from './CharacterInfo.styled';
import Typography from '@mui/material/Typography';

export type CharacterInfoProps = {
  characterInfo: RemoteData<ClientError, CharacterInfo>;
  onCharacterInfoSave: (character: CharacterInfo) => void;
};

export const CharacterInfoLoader = (props: CharacterInfoProps) => {
  const { characterInfo, onCharacterInfoSave } = props;

  return (
    <Styled.Container>
      <RemoteDataDefault
        data={characterInfo}
        onSuccess={(info) => (
          <CharacterInfoForm
            characterInfo={info}
            onCharacterInfoSave={onCharacterInfoSave}
          />
        )}
      />
    </Styled.Container>
  );
};

type CharacterInfoFormProps = {
  characterInfo: CharacterInfo;
  onCharacterInfoSave: (character: CharacterInfo) => void;
};

const requiredString = z.string().trim().min(1, 'Required');

const characterInfoValidation = z.object({
  name: requiredString,
  mass: z.string().regex(/^[0-9]+$/, { message: 'Enter a number' }),
  hairColor: requiredString,
  films: z.array(
    z.object({
      id: z.number(),
      title: requiredString,
    }),
  ),
});

type CharacterInfoValidation = z.infer<typeof characterInfoValidation>;

const getDefaultValues = ({
  name,
  mass,
  hair_color,
  films,
}: CharacterInfo): CharacterInfoValidation => ({
  name,
  mass,
  hairColor: hair_color,
  films,
});

const CharacterInfoForm = (props: CharacterInfoFormProps) => {
  const { characterInfo, onCharacterInfoSave } = props;
  const {
    register: baseRegister,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CharacterInfoValidation>({
    defaultValues: getDefaultValues(characterInfo),
    resolver: zodResolver(characterInfoValidation),
    mode: 'onBlur',
  });
  const onSubmit = handleSubmit((data) => {
    onCharacterInfoSave({ ...characterInfo, ...data, mass: String(data.mass) });
  });
  const getError = getMuiError(errors);
  const register = <P extends FieldPath<CharacterInfoValidation>>(path: P) => ({
    ...baseRegister(path),
    ...getError(path),
  });

  const { fields, remove, append } = useFieldArray({
    control,
    name: 'films',
    keyName: 'id',
  });

  return (
    <Styled.Form onSubmit={onSubmit}>
      <Styled.CharacterFieldsContainer>
        <Styled.CharacterFieldsTitle>
          <Typography>Character info</Typography>
        </Styled.CharacterFieldsTitle>
        <Styled.CharacterFields>
          <TextField {...register('name')} label="Name" size="small" />
          <TextField {...register('mass')} label="Mass" size="small" />
          <TextField
            {...register('hairColor')}
            label="Hair color"
            size="small"
          />
        </Styled.CharacterFields>
      </Styled.CharacterFieldsContainer>
      <Styled.FilmFields>
        <Typography>Character films</Typography>
        {fields.map((item, index) => (
          <Styled.FilmField key={item.id}>
            <TextField {...register(`films.${index}.title`)} size="small" />
            <Button onClick={() => remove(index)} size="small">
              <DeleteIcon />
            </Button>
          </Styled.FilmField>
        ))}
        <div>
          <Button
            onClick={() => append({ id: Math.random(), title: 'New title' })}
            size="small"
          >
            <AddIcon />
          </Button>
        </div>
      </Styled.FilmFields>
      <Styled.Footer>
        <Button
          type="submit"
          onClick={() => onCharacterInfoSave(characterInfo)}
        >
          Save
        </Button>
      </Styled.Footer>
    </Styled.Form>
  );
};
