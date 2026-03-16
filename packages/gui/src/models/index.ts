export * from "./page";
export * from "./settings";
export * from "./capability-model";

export type UserType = "user" | "moderator" | "admin";

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
