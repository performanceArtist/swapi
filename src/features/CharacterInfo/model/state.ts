import { useContext, useEffect } from 'react';
import { z } from 'zod';
import {
  iPlanetSchema,
  iSpecieSchema,
  iStarshipSchema,
  iVehicleSchema,
} from '../../../api/schemas';
import { getURLId } from '../../../shared/utils';
import { AppContext } from '../../../AppContext';
import { CharacterInfo } from '../../../shared/types';
import { pipe, RemoteData, remoteData } from '../../../shared/functional';
import { usePromiseRD } from '../../../shared/hooks/usePromise';
import { IPeople } from '../../../api/interfaces';
import { ClientError } from '../../../shared/types';

export type CharacterInfoContainerProps = {
  id: number;
};

const filmSchema = z.object({
  id: z.number(),
  title: z.string(),
});

type Film = z.infer<typeof filmSchema>;

const characterInfoSchema: z.ZodSchema<
  Omit<IPeople, 'films'> & { films: Film[] }
> = z.lazy(() =>
  z.object({
    birth_year: z.string(),
    eye_color: z.string(),
    films: z.array(filmSchema),
    gender: z.string(),
    hair_color: z.string(),
    height: z.string(),
    homeworld: z.union([z.string(), iPlanetSchema]),
    mass: z.string(),
    name: z.string(),
    skin_color: z.string(),
    created: z.coerce.date(),
    edited: z.coerce.date(),
    species: z.union([z.array(z.string()), z.array(iSpecieSchema)]),
    starships: z.union([z.array(z.string()), z.array(iStarshipSchema)]),
    url: z.string(),
    vehicles: z.union([z.array(z.string()), z.array(iVehicleSchema)]),
  }),
);

export const useCharacterInfoModel = (props: CharacterInfoContainerProps) => {
  const { id } = props;
  const { SWApi } = useContext(AppContext);

  const fetchCharacterInfo = (): Promise<
    RemoteData<ClientError, CharacterInfo>
  > =>
    pipe(
      SWApi.getCharacter(id),
      remoteData.chainPromise((character) => {
        const ids = character.films.reduce((acc, cur) => {
          const id =
            typeof cur === 'string' ? getURLId(cur) : getURLId(cur.url);
          return id !== null ? acc.concat(id) : acc;
        }, [] as number[]);

        return Promise.all(ids.map(SWApi.getFilm)).then((rds) =>
          pipe(
            remoteData.combine(...rds),
            remoteData.map(
              (films): CharacterInfo => ({
                ...character,
                films: films.reduce(
                  (acc, cur) => {
                    const id = getURLId(cur.url);
                    return id !== null
                      ? acc.concat({ id, title: cur.title })
                      : acc;
                  },
                  [] as CharacterInfo['films'],
                ),
              }),
            ),
          ),
        );
      }),
    );

  const getLocalCharacterInfo = (): {
    data: null | CharacterInfo[];
    character: null | CharacterInfo;
  } => {
    const stored = localStorage.getItem('characters');
    try {
      const json = JSON.parse(stored!);
      const storedParsed = z.array(characterInfoSchema).safeParse(json);
      const storedData = storedParsed.data || null;
      const character = storedData
        ? storedData.find((c) => getURLId(c.url) === id) || null
        : null;

      return {
        data: storedData,
        character,
      };
    } catch {
      return {
        data: null,
        character: null,
      };
    }
  };

  const getCharacterInfoWorker: () => Promise<
    RemoteData<ClientError, CharacterInfo>
  > = () => {
    const { data, character } = getLocalCharacterInfo();

    if (character) return Promise.resolve(remoteData.makeSuccess(character));

    return fetchCharacterInfo().then((c) => {
      if (c.type === 'success') {
        saveToLocalStorage(data || [], c.data);
      }
      return c;
    });
  };

  const saveToLocalStorage = (data: CharacterInfo[], update: CharacterInfo) => {
    const exists = data.find((c) => getURLId(c.url) === getURLId(update.url));
    const updated = exists
      ? data.map((c) => (getURLId(c.url) === getURLId(update.url) ? update : c))
      : data.concat(update);

    localStorage.setItem('characters', JSON.stringify(updated));
  };

  const [characterInfo, getCharacterInfo] = usePromiseRD(
    getCharacterInfoWorker,
  );
  useEffect(getCharacterInfo, []);

  const saveCharacterInfo = (characterUpdate: CharacterInfo) => {
    const { data } = getLocalCharacterInfo();
    saveToLocalStorage(data || [], characterUpdate);
  };

  return {
    characterInfo,
    saveCharacterInfo,
  };
};
