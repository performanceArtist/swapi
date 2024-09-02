import axios, { AxiosResponse } from 'axios';
import { iFilmSchema, iPeopleSchema } from './schemas';
import { ZodSchema } from 'zod';
import { remoteData, RemoteData } from '../shared/functional';
import { z } from 'zod';
import { ClientError } from '../shared/types';

export type SWApiOptions = {
  baseURL: string;
  logs: boolean;
};

export const makeSWApi = (options: SWApiOptions) => {
  const { baseURL, logs } = options;

  const processResponse = <R>(
    schema: ZodSchema<R>,
    worker: () => Promise<AxiosResponse>,
  ): Promise<RemoteData<ClientError, R>> =>
    worker()
      .then((res) => {
        const result = schema.safeParse(res.data);

        return result.error
          ? remoteData.makeError<ClientError, R>({
              type: 'validationError',
              error: result.error,
            })
          : remoteData.makeSuccess<ClientError, R>(result.data);
      })
      .catch((e) =>
        remoteData.makeError<ClientError, R>({
          type: 'networkError',
          error: e,
        }),
      )
      .then((result) => {
        if (logs) {
          if (result.type === 'error') {
            console.error('err', result.error);
          } else if (result.type === 'success') {
            console.log('succ', result.data);
          }
        }
        return result;
      });

  return {
    getPeople: ({ page, nameSearch }: { page: number; nameSearch?: string }) =>
      processResponse(getResponseSchema(z.array(iPeopleSchema)), () =>
        axios.get(`${baseURL}/api/people`, {
          params: { search: nameSearch, page },
        }),
      ),
    getCharacter: (id: number) =>
      processResponse(iPeopleSchema, () =>
        axios.get(`${baseURL}/api/people/${id}`),
      ),
    getFilms: () =>
      processResponse(getResponseSchema(z.array(iFilmSchema)), () =>
        axios.get(`${baseURL}/api/films`),
      ),
    getFilm: (id: number) =>
      processResponse(iFilmSchema, () =>
        axios.get(`${baseURL}/api/films/${id}`),
      ),
  };
};

export type SWApi = ReturnType<typeof makeSWApi>;

export interface SWApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T;
}

const getResponseSchema = <R>(results: ZodSchema<R>) =>
  z.object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results,
  }) as ZodSchema<SWApiResponse<R>>;
