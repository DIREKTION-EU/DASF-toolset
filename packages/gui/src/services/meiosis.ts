import { meiosisSetup } from 'meiosis-setup';
import type { MeiosisCell, MeiosisConfig, Service } from 'meiosis-setup/types';
import m, { type FactoryComponent } from 'mithril';
import { routingSvc } from '.';
import { type DataModel, Pages, type SearchResults } from '../models';
import { type Settings, type SearchResultItem } from '@dasf-toolset/shared';
import { type User, type UserRole } from './login-service';
import { scrollToTop } from '../utils';

export const EmptyDataModel = () =>
  ({
    version: 1,
    lastUpdate: Date.now(),
  }) as DataModel;

// const settingsSvc = restServiceFactory<Settings>('settings');
const MODEL_KEY = 'MITHRIL_APP_MODEL';
const USER_ROLE = 'USER_ROLE';
const SETTINGS_KEY = 'MITHRIL_APP_SETTINGS';
// Vite injects import.meta.env.APP_TITLE from .env files at build time
export const APP_TITLE = import.meta.env.APP_TITLE || 'Mithril App';
export const APP_TITLE_SHORT = import.meta.env.APP_TITLE_SHORT || 'Mithril';

export interface State {
  page: Pages;
  model: DataModel;
  loggedInUser?: User;
  role: UserRole;
  settings: Settings;
  searchFilter: string;
  searchResults: SearchResults;
}

export type MeiosisComponent<A = {}> = FactoryComponent<MeiosisCell<State> & A>;

export const actions = {
  // addDucks: (cell, amount) => {
  //   cell.update({ ducks: (value) => value + amount });
  // },
  setPage: (cell: MeiosisCell<State>, page: Pages, info?: string) => {
    document.title = `${APP_TITLE} | ${page.replace('_', ' ')}${info ? ` | ${info}` : ''}`;
    // const curPage = states().page;
    // if (curPage === page) return;
    cell.update({
      page: () => {
        scrollToTop();
        return page;
      },
    });
  },
  changePage: (
    cell: MeiosisCell<State>,
    page: Pages,
    params?: Record<string, string | number | undefined>,
    query?: Record<string, string | number | undefined>
  ) => {
    routingSvc && routingSvc.switchTo(page, params, query);
    document.title = `${APP_TITLE} | ${page.replace('_', ' ')}`;
    cell.update({ page });
  },
  saveModel: (cell: MeiosisCell<State>, model: DataModel) => {
    model.lastUpdate = Date.now();
    model.version = model.version ? model.version++ : 1;
    localStorage.setItem(MODEL_KEY, JSON.stringify(model));
    console.log(JSON.stringify(model, null, 2));
    cell.update({ model: () => model });
  },
  saveSettings: async (cell: MeiosisCell<State>, settings: Settings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    cell.update({
      settings: () => settings,
    });
  },
  setSearchFilter: async (cell: MeiosisCell<State>, searchFilter?: string) => {
    if (searchFilter) {
      // localStorage.setItem(SEARCH_FILTER_KEY, searchFilter);
      cell.update({ searchFilter });
    } else {
      cell.update({ searchFilter: undefined });
    }
  },
  setRole: (cell: MeiosisCell<State>, role: UserRole) => {
    localStorage.setItem(USER_ROLE, role);
    cell.update({ role });
  },
  login: (_cell: MeiosisCell<State>) => {},
};

// Helper to retrieve model data from localStorage
const getModelData = (): Record<string, unknown> => {
  try {
    const stored = localStorage.getItem(MODEL_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Return the model's data property if it exists, otherwise return the whole model
      return parsed.data || parsed;
    }
  } catch (e) {
    console.error('Error parsing model from localStorage:', e);
  }
  return {};
};

// Helper to search through model data for matching items
const searchModelData = (filter: string): SearchResultItem[] => {
  if (!filter || filter.trim() === '') {
    return [];
  }

  const searchTerm = filter.toLowerCase().trim();
  const modelData = getModelData();
  const results: SearchResultItem[] = [];

  // Helper function to check if a value matches the search term
  const matchesSearch = (value: unknown): boolean => {
    if (value === null || value === undefined) {
      return false;
    }
    const str = String(value).toLowerCase();
    return str.includes(searchTerm);
  };

  // Helper to recursively search through objects
  const searchObject = (obj: Record<string, unknown>, path: string[] = []) => {
    if (obj === null || obj === undefined) {
      return;
    }

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          searchObject(item as Record<string, unknown>, [...path, `[${index}]`]);
        }
      });
      return;
    }

    if (typeof obj === 'object') {
      // Check if this object has searchable fields (title, description, content, type)
      const searchableFields = ['title', 'description', 'content', 'type', 'name', 'authors'];
      const hasSearchableField = searchableFields.some((field) => obj[field] !== undefined);

      if (hasSearchableField) {
        const matchFields = searchableFields.filter((field) => matchesSearch(obj[field]));
        if (matchFields.length > 0) {
          const title = typeof obj.title === 'string' ? obj.title : undefined;
          const name = typeof obj.name === 'string' ? obj.name : undefined;
          const description = typeof obj.description === 'string' ? obj.description : undefined;
          const content = typeof obj.content === 'string' ? obj.content : undefined;
          results.push({
            title,
            name,
            description,
            content,
            _matchedFields: matchFields,
            _path: path.join('.'),
          });
        }
      }

      // Recursively search nested objects
      Object.entries(obj).forEach(([key, value]) => {
        // Skip metadata fields
        if (!['version', 'lastUpdate'].includes(key)) {
          if (typeof value === 'object' && value !== null) {
            searchObject(value as Record<string, unknown>, [...path, key]);
          }
        }
      });
    }
  };

  searchObject(modelData);
  return results;
};

export const setSearchResults: Service<State> = {
  onchange: (state) => state.searchFilter,
  run: (cell) => {
    const state = cell.getState();
    const { searchFilter } = state;
    console.log(`Searching ${searchFilter}`);
    const results = searchFilter ? searchModelData(searchFilter) : [];
    cell.update({ searchResults: () => results });
  },
};

export const settingsSaveService: Service<State> = {
  onchange: (state) => state.settings,
  run: (cell) => {
    const state = cell.getState();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
  },
};

const config: MeiosisConfig<State> = {
  app: {
    initial: {
      page: Pages.HOME,
      loggedInUser: undefined,
      role: 'user',
      settings: {} as Settings,
    } as State,
    services: [setSearchResults, settingsSaveService],
  },
};
export const cells = meiosisSetup<State>(config);

cells.map(() => {
  // console.log('...redrawing');
  m.redraw();
});

const loadData = async () => {
  const role = (localStorage.getItem(USER_ROLE) || 'user') as UserRole;
  const ds = localStorage.getItem(MODEL_KEY);
  const model: DataModel = ds ? JSON.parse(ds) : EmptyDataModel();
  const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') as Settings;

  cells().update({
    role,
    model: () => model,
    settings: () => settings || ({} as Settings),
  });
};
loadData();
