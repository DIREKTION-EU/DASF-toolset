export type UserRole = 'admin' | 'editor' | 'user';

export type User = {
  name: string;
  role: UserRole;
};

export type Settings = {
  language: string;
  theme: 'light' | 'dark';
  preferences: Record<string, unknown>;
};

export type SearchResultItem = {
  title?: string;
  name?: string;
  description?: string;
  content?: string;
  _matchedFields: string[];
  _path: string;
};
