export type Document = {
  id: string;
  title: string;
  content: string;
  description?: string;
  type: string;
  authors: string[];
  createdAt: number;
  updatedAt: number;
  status?: 'draft' | 'published' | 'archived';
};

export type DataModel = {
  version: number;
  lastUpdate: number;
  documents: Record<string, Document>;
};
