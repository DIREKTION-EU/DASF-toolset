export const stakeholderIds = (value?: string | string[]): string[] =>
  Array.isArray(value) ? value : value ? [value] : [];
