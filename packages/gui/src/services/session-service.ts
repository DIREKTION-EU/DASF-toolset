import { ldb } from '../utils/local-ldb';
import type { CapabilityModel } from '../models/capability-model/capability-model';

const SESSION_LIST_KEY = 'DASF_SESSIONS';
const SESSION_PREFIX = 'DASF_SESSION_';

export interface ISession {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  model: CapabilityModel;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

async function getSessionIndex(): Promise<Array<{ id: string; name: string; createdAt: number; updatedAt: number }>> {
  try {
    const raw = await ldb.get(SESSION_LIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function saveSessionIndex(index: Array<{ id: string; name: string; createdAt: number; updatedAt: number }>): Promise<void> {
  await ldb.set(SESSION_LIST_KEY, JSON.stringify(index));
}

export const sessionService = {
  async listSessions(): Promise<Array<{ id: string; name: string; createdAt: number; updatedAt: number }>> {
    return getSessionIndex();
  },

  async getSession(id: string): Promise<ISession | null> {
    try {
      const raw = await ldb.get(SESSION_PREFIX + id);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  async saveSession(session: ISession): Promise<void> {
    session.updatedAt = Date.now();
    await ldb.set(SESSION_PREFIX + session.id, JSON.stringify(session));
    const index = await getSessionIndex();
    const existing = index.findIndex(s => s.id === session.id);
    const entry = { id: session.id, name: session.name, createdAt: session.createdAt, updatedAt: session.updatedAt };
    if (existing >= 0) {
      index[existing] = entry;
    } else {
      index.push(entry);
    }
    await saveSessionIndex(index);
  },

  async createSession(name: string, model: CapabilityModel): Promise<ISession> {
    const now = Date.now();
    const session: ISession = {
      id: generateId(),
      name,
      createdAt: now,
      updatedAt: now,
      model,
    };
    await sessionService.saveSession(session);
    return session;
  },

  async deleteSession(id: string): Promise<void> {
    await ldb.delete(SESSION_PREFIX + id);
    const index = await getSessionIndex();
    await saveSessionIndex(index.filter(s => s.id !== id));
  },

  async cloneSession(id: string, clearUserData = false): Promise<ISession | null> {
    const original = await sessionService.getSession(id);
    if (!original) return null;
    const cloned = JSON.parse(JSON.stringify(original.model)) as CapabilityModel;
    if (clearUserData) {
      const { data } = cloned;
      if (data.capabilities) {
        data.capabilities.forEach(c => {
          delete c.taskAssessment;
          delete c.performanceAssessment;
          delete c.assessmentId;
          delete c.shouldDevelop;
          delete c.gaps;
        });
      }
      data.solutions = [];
      data.roadmapItems = [];
      data.selectedHazardIds = [];
      if (data.hazardTypes) {
        data.hazardTypes.forEach(h => {
          h.selected = false;
          delete h.description;
        });
      }
    }
    return sessionService.createSession(`${original.name} (copy)`, cloned);
  },

  async exportSession(id: string): Promise<string | null> {
    const session = await sessionService.getSession(id);
    if (!session) return null;
    return JSON.stringify(session, null, 2);
  },

  async importSession(json: string): Promise<ISession> {
    const imported = JSON.parse(json) as ISession;
    imported.id = generateId();
    imported.createdAt = Date.now();
    imported.updatedAt = Date.now();
    await sessionService.saveSession(imported);
    return imported;
  },
};
