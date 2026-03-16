export * from './page';
export * from './settings';
export * from './data-model';

export interface ILokiObj {
  id: number;
}

export type SearchResultItem = {
  title?: string;
  name?: string;
  description?: string;
  content?: string;
  _matchedFields: string[];
  _path: string;
};

export type SearchResults<T = SearchResultItem> = T[];

export type LdbOperation<T> = Promise<T>;
