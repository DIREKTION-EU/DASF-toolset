import { meiosisSetup } from "meiosis-setup";
import type { MeiosisCell, MeiosisConfig, Service } from "meiosis-setup/types";
import m, { type FactoryComponent } from "mithril";
import { i18n, routingSvc } from ".";
// Import types/values directly to avoid circular dependency through barrel
import type { Assessment } from "../models/capability-model/assessment";
import { assessmentModel } from "../models/capability-model/assessment";
import type { Development } from "../models/capability-model/development";
import { developmentModel } from "../models/capability-model/development";
import type {
  Evaluation,
  ProjectEvaluation,
  ICapabilityDataModel,
  CapabilityModel,
} from "../models/capability-model/capability-model";
import { defaultCapabilityModel } from "../models/capability-model/capability-model";
import {
  evaluationModel,
  projectEvaluationModel,
} from "../models/capability-model/evaluation";
import { preparationModel } from "../models/capability-model/preparation";
import { settingsModel } from "../models/capability-model/settings";
import { Pages } from "../models/page";
import { type SearchResultItem } from "@dasf-toolset/shared";
import { type User, type UserRole } from "./login-service";
import { scrollToTop, LANGUAGE } from "../utils";
import { UIForm } from "mithril-ui-form";
import { sessionService } from "./session-service";

// Inline types to avoid importing from barrel (circular dependency)
type UserType = "user" | "moderator" | "admin";
type SearchResults<T = SearchResultItem> = T[];

export const EmptyDataModel = () =>
  ({
    version: 1,
    lastUpdate: Date.now(),
  }) as CapabilityModel;

// const settingsSvc = restServiceFactory<Settings>('settings');
const MODEL_KEY = "DASF_MODEL";
const USER_ROLE = "DASF_USER_ROLE";
const SETTINGS_KEY = "DASF_SETTINGS";
const CUR_USER_KEY = "DASF_CUR_USER";
const LAST_SESSION_KEY = "DASF_LAST_SESSION";

// Vite injects import.meta.env.APP_TITLE from .env files at build time
export const APP_TITLE = import.meta.env.APP_TITLE || "Mithril App";
export const APP_TITLE_SHORT = import.meta.env.APP_TITLE_SHORT || "Mithril";

export interface State {
  page: Pages;
  model?: CapabilityModel;
  loggedInUser?: User;
  role: UserRole;
  settings: UIForm<ICapabilityDataModel>;
  searchFilter?: string;
  searchResults?: SearchResults;

  curUser?: UserType;
  apiService?: string;
  isSearching?: boolean;
  searchQuery?: string;
  catModel?: CapabilityModel;
  textFilter?: string;
  stakeholderFilter?: string[];
  categoryId?: string;
  subcategoryId?: string;
  capabilityId?: string;
  drawerItem?: {
    type: "capability" | "hazard" | "solution" | "roadmap";
    id: string;
  };
  // Session management
  sessions: Array<{
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
  }>;
  currentSessionId?: string;
  // FORMS
  preparations?: UIForm<ICapabilityDataModel>;
  assessment?: UIForm<Assessment>;
  development?: UIForm<Development>;
  evaluation?: UIForm<Partial<Evaluation>>;
  projectEvaluation?: UIForm<Partial<ProjectEvaluation>>;
}

export type MeiosisComponent<A = {}> = FactoryComponent<MeiosisCell<State> & A>;

const localizeDataModel = (state: Partial<State>) => {
  if (!state) return;
  state.assessment = assessmentModel(
    state.catModel && state.catModel.data ? state.catModel.data : {},
  );
  state.development = developmentModel();
  state.settings = settingsModel();
  state.evaluation = evaluationModel();
  state.projectEvaluation = projectEvaluationModel();
  state.preparations = preparationModel();
  return state;
};

export const actions = {
  // addDucks: (cell, amount) => {
  //   cell.update({ ducks: (value) => value + amount });
  // },
  update: (cell: MeiosisCell<State>, state: Partial<State>) =>
    cell.update(state),
  openDrawer: (
    cell: MeiosisCell<State>,
    type: "capability" | "hazard" | "solution" | "roadmap",
    id: string,
  ) => cell.update({ drawerItem: { type, id } }),
  closeDrawer: (cell: MeiosisCell<State>) =>
    cell.update({ drawerItem: undefined }),
  setPage: (cell: MeiosisCell<State>, page: Pages, info?: string) => {
    document.title = `${APP_TITLE} | ${page.replace("_", " ")}${info ? ` | ${info}` : ""}`;
    // const curPage = states().page;
    // if (curPage === page) return;
    cell.update({
      page: () => {
        scrollToTop();
        return page;
      },
    });
  },
  setLanguage: async (
    cell: MeiosisCell<State>,
    locale = i18n.currentLocale,
  ) => {
    const state = cell.getState();
    localStorage.setItem(LANGUAGE, locale);
    await i18n.loadAndSetLocale(locale);
    cell.update({ ...localizeDataModel(state) });
  },
  changePage: (
    cell: MeiosisCell<State>,
    page: Pages,
    params?: Record<string, string | number | undefined>,
    query?: Record<string, string | number | undefined>,
  ) => {
    routingSvc && routingSvc.switchTo(page, params, query);
    document.title = `${APP_TITLE} | ${page.replace("_", " ")}`;
    cell.update({ page });
  },
  createRoute: (
    page: Pages,
    params?: { [key: string]: string | number | undefined },
  ) => (routingSvc ? routingSvc.route(page, params) : ""),
  saveModel: (cell: MeiosisCell<State>, model: CapabilityModel) => {
    model.lastUpdate = Date.now();
    model.version = model.version ? model.version + 1 : 1;
    localStorage.setItem(MODEL_KEY, JSON.stringify(model));
    cell.update({ model: () => model, catModel: () => model });
    // Also persist to IndexedDB session
    const state = cell.getState();
    if (state.currentSessionId) {
      sessionService.getSession(state.currentSessionId).then((session) => {
        if (session) {
          session.model = model;
          sessionService.saveSession(session);
        }
      });
    }
  },
  saveSettings: async (
    cell: MeiosisCell<State>,
    settings: UIForm<ICapabilityDataModel>,
  ) => {
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

  saveCurUser: (cell: MeiosisCell<State>, curUser: UserType) => {
    localStorage.setItem(CUR_USER_KEY, curUser);
    cell.update({ curUser });
  },

  // Session management
  loadSessions: async (cell: MeiosisCell<State>) => {
    const sessions = await sessionService.listSessions();
    cell.update({ sessions: () => sessions });
  },

  createSession: async (cell: MeiosisCell<State>, name: string) => {
    const model = defaultCapabilityModel();
    const session = await sessionService.createSession(name, model);
    const sessions = await sessionService.listSessions();
    localStorage.setItem(MODEL_KEY, JSON.stringify(session.model));
    localStorage.setItem(LAST_SESSION_KEY, session.id);
    cell.update({
      sessions: () => sessions,
      currentSessionId: session.id,
      catModel: () => session.model,
      model: () => session.model,
    });
    routingSvc && routingSvc.switchTo(Pages.HOME);
  },

  openSession: async (cell: MeiosisCell<State>, id: string) => {
    const session = await sessionService.getSession(id);
    if (!session) return;
    localStorage.setItem(MODEL_KEY, JSON.stringify(session.model));
    localStorage.setItem(LAST_SESSION_KEY, id);
    cell.update({
      currentSessionId: id,
      catModel: () => session.model,
      model: () => session.model,
    });
    routingSvc && routingSvc.switchTo(Pages.HOME);
  },

  deleteSession: async (cell: MeiosisCell<State>, id: string) => {
    await sessionService.deleteSession(id);
    const sessions = await sessionService.listSessions();
    const state = cell.getState();
    const isCurrentSession = state.currentSessionId === id;
    if (isCurrentSession) localStorage.removeItem(LAST_SESSION_KEY);
    cell.update({
      sessions: () => sessions,
      ...(isCurrentSession ? { currentSessionId: undefined } : {}),
    });
  },

  cloneSession: async (
    cell: MeiosisCell<State>,
    id: string,
    clearUserData = false,
  ) => {
    await sessionService.cloneSession(id, clearUserData);
    const sessions = await sessionService.listSessions();
    cell.update({ sessions: () => sessions });
  },

  saveCurrentSession: async (cell: MeiosisCell<State>) => {
    const state = cell.getState();
    if (!state.currentSessionId) return;
    const session = await sessionService.getSession(state.currentSessionId);
    if (!session || !state.catModel) return;
    session.model = state.catModel;
    await sessionService.saveSession(session);
  },
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
    console.error("Error parsing model from localStorage:", e);
  }
  return {};
};

// Helper to search through model data for matching items
const searchModelData = (filter: string): SearchResultItem[] => {
  if (!filter || filter.trim() === "") {
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
        if (typeof item === "object" && item !== null) {
          searchObject(item as Record<string, unknown>, [
            ...path,
            `[${index}]`,
          ]);
        }
      });
      return;
    }

    if (typeof obj === "object") {
      // Check if this object has searchable fields (title, description, content, type)
      const searchableFields = [
        "title",
        "description",
        "content",
        "type",
        "name",
        "authors",
      ];
      const hasSearchableField = searchableFields.some(
        (field) => obj[field] !== undefined,
      );

      if (hasSearchableField) {
        const matchFields = searchableFields.filter((field) =>
          matchesSearch(obj[field]),
        );
        if (matchFields.length > 0) {
          const title = typeof obj.title === "string" ? obj.title : undefined;
          const name = typeof obj.name === "string" ? obj.name : undefined;
          const description =
            typeof obj.description === "string" ? obj.description : undefined;
          const content =
            typeof obj.content === "string" ? obj.content : undefined;
          results.push({
            title,
            name,
            description,
            content,
            _matchedFields: matchFields,
            _path: path.join("."),
          });
        }
      }

      // Recursively search nested objects
      Object.entries(obj).forEach(([key, value]) => {
        // Skip metadata fields
        if (!["version", "lastUpdate"].includes(key)) {
          if (typeof value === "object" && value !== null) {
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
      page: Pages.LANDING,
      loggedInUser: undefined,
      role: "user",
      settings: [] as UIForm<ICapabilityDataModel>,
      sessions: [],
    } as State,
    services: [setSearchResults, settingsSaveService],
  },
};
export const cells = meiosisSetup<State>(config);

cells.map(() => {
  // console.log('...redrawing');
  m.redraw();
});

export const loadData = async () => {
  const role = (localStorage.getItem(USER_ROLE) || "user") as UserRole;

  let model: CapabilityModel;

  const ds = localStorage.getItem(MODEL_KEY);
  if (ds) {
    try {
      model = JSON.parse(ds);
    } catch (err) {
      console.warn(
        "Invalid model in localStorage, falling back to default",
        err,
      );
      model = defaultCapabilityModel();
    }
  } else {
    model = defaultCapabilityModel();
  }

  const curUser = (localStorage.getItem(CUR_USER_KEY) || "user") as UserType;
  const settings = JSON.parse(
    localStorage.getItem(SETTINGS_KEY) || "[]",
  ) as UIForm<ICapabilityDataModel>;

  // Load sessions from IndexedDB
  const sessions = await sessionService.listSessions();

  // Restore last active session
  const lastSessionId = localStorage.getItem(LAST_SESSION_KEY);
  const lastSession = lastSessionId
    ? await sessionService.getSession(lastSessionId)
    : null;
  if (lastSession) {
    model = lastSession.model;
    localStorage.setItem(MODEL_KEY, JSON.stringify(model));
  }

  const forms = localizeDataModel({ catModel: model }) || {};

  cells().update({
    role,
    curUser,
    model: () => model,
    catModel: () => model,
    sessions: () => sessions,
    ...(lastSession ? { currentSessionId: lastSessionId! } : {}),
    assessment: () => forms.assessment!,
    development: () => forms.development!,
    settings: () => forms.settings || settings || [],
    evaluation: () => forms.evaluation!,
    projectEvaluation: () => forms.projectEvaluation!,
    preparations: () => forms.preparations!,
  });
};

// Defer loadData to avoid circular dependency during module initialization
setTimeout(loadData, 0);
