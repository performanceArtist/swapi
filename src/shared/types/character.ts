import { IPeople } from '../../api/interfaces';

export type Character = IPeople;

export type CharacterInfo = Omit<IPeople, 'films'> & {
  films: { id: number; title: string }[];
};
