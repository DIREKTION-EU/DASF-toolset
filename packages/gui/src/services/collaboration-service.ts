import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import type { CapabilityModel } from "../models/capability-model/capability-model";
import type { ICapability } from "../models/capability-model/capability-model";
import type { IHazardType } from "../models/capability-model/hazard";
import type { ISolution } from "../models/capability-model/solution";
import type { State } from "./meiosis";

// ─── Entity Reference ───────────────────────────────────────────────────────
// String for known model entities (label can be looked up from shared model).
// Tuple for custom/new entries that carry their own label (+ optional desc).
export type EntityRef = string | [id: string, label: string, desc?: string];

export const entityId = (ref: EntityRef): string =>
  Array.isArray(ref) ? ref[0] : ref;

export const entityLabel = (ref: EntityRef, fallback?: string): string =>
  Array.isArray(ref) ? ref[1] : (fallback ?? ref);

// ─── Collaboration Modes ─────────────────────────────────────────────────────
export type CollabMode = "ca" | "sc" | "sa";

// ─── Compact Invite Payload (Facilitator → User) ─────────────────────────────
export interface InvitePayload {
  /** sessionId */
  s: string;
  /** app version */
  v: string;
  /** modes: "ca" | "sc" | "sa" */
  m: CollabMode[];
  /** facilitatorName */
  fn: string;
  /** facilitatorEmail */
  fe: string;
  /** selected hazard refs */
  h: EntityRef[];
  /** selected capability refs (for "ca" mode) */
  c: EntityRef[];
  /** solution refs to assess (for "sa" mode) */
  sol?: EntityRef[];
  /** SHA-256 hash of the base model JSON (hex) */
  bh: string;
}

export interface CapabilityAssessmentResponseItem {
  id: string;
  v?: string;
  d?: string;
}

// ─── Compact Capability Assessment Answer ────────────────────────────────────
export interface CapabilityAnswer {
  /** capabilityId */
  c: string;
  /** taskAssessment: overall assessmentId + per-item {id, v} */
  ta?: { a: string; i: CapabilityAssessmentResponseItem[] };
  /** performanceAssessment: overall assessmentId + per-item {id, v} */
  pa?: { a: string; i: CapabilityAssessmentResponseItem[] };
  /** actionPriority 1–5 */
  ap?: number;
  /** gap assessments: per-gap { t/d + a: overallAssessmentId, i: per-item answers } */
  g?: {
    t?: string;
    d?: string;
    a: string;
    i: CapabilityAssessmentResponseItem[];
  }[];
}

export interface SolutionAssessmentAnswer {
  /** solutionId */
  i: string;
  /** Technology readiness level */
  trl?: number;
  /** Integration readiness level */
  integrationRl?: number;
  /** Societal readiness level */
  societalRl?: number;
  /** Manufacturing readiness level */
  manufacturingRl?: number;
  /** Commercialisation readiness level */
  commercialisationRl?: number;
  /** Security readiness level */
  securityRl?: number;
  /** Legal, privacy & ethical readiness level */
  legalPrivacyEthicalRl?: number;
  /** impact score */
  imp?: number;
  /** note */
  n?: string;
}

// ─── Compact Patch Payload (User → Facilitator) ──────────────────────────────
export interface CollaborationPatch {
  /** patchId (UUID) */
  pid: string;
  /** sessionId */
  sid: string;
  /** baseModelHash */
  bh: string;
  /** userName */
  un?: string;
  /** userEmail */
  ue?: string;
  /** modes covered by this patch */
  m: CollabMode[];
  /** createdAt ISO string */
  at: string;
  /** capability assessment answers */
  ca?: CapabilityAnswer[];
  /** solution creation */
  sc?: { i: EntityRef; trl?: number; ci?: string[] }[];
  /** solution assessment */
  sa?: SolutionAssessmentAnswer[];
}

// ─── Aggregated Result ───────────────────────────────────────────────────────
export interface AggregatedCapability {
  capabilityId: string;
  /** contributor count */
  count: number;
  /** averaged actionPriority */
  avgActionPriority?: number;
  /** per task-item: averaged values */
  taskItems: { id: string; avgValue: string; allValues: string[] }[];
  /** per performance-item: averaged values */
  performanceItems: { id: string; avgValue: string; allValues: string[] }[];
  /** per gap: all gap assessment values collected */
  gaps: {
    gapIndex: number;
    titles: string[];
    descriptions: string[];
    items: { id: string; allValues: string[] }[];
  }[];
}

// ─── Encode / Decode ─────────────────────────────────────────────────────────

export const encodePayload = (obj: unknown): string =>
  compressToEncodedURIComponent(JSON.stringify(obj));

export const decodePayload = <T>(encoded: string): T => {
  const decompressed = decompressFromEncodedURIComponent(encoded);
  if (!decompressed) throw new Error("Failed to decompress payload");
  return JSON.parse(decompressed) as T;
};

// ─── SHA-256 Hash ────────────────────────────────────────────────────────────

export const hashModel = async (model: unknown): Promise<string> => {
  const text = JSON.stringify(model);
  const buffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text),
  );
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

// ─── UUID ────────────────────────────────────────────────────────────────────

export const generateUUID = (): string => {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  // Fallback for older browsers
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// ─── Build Invite Payload ────────────────────────────────────────────────────

const toEntityRef = (
  entity: { id: string; label: string; desc?: string },
  knownIds: Set<string>,
): EntityRef => {
  if (knownIds.has(entity.id)) return entity.id;
  return entity.desc
    ? [entity.id, entity.label, entity.desc]
    : [entity.id, entity.label];
};

export const buildInvitePayload = async (
  state: State,
  modes: CollabMode[],
  facilitatorName: string,
  facilitatorEmail: string,
  appVersion = "1.0",
): Promise<InvitePayload> => {
  const data = state.catModel?.data ?? {};

  // IDs present in the default/shared model – no label needed in the URL
  const knownHazardIds = new Set<string>([
    "N01",
    "N02",
    "N03",
    "N04",
    "N05",
    "N06",
    "N07",
    "N08",
    "N09",
    "N10",
    "N11",
    "N12",
    "N13",
    "T01",
    "T02",
    "T03",
    "T04",
    "T05",
    "T06",
    "T07",
    "T08",
    "T09",
    "T10",
    "T11",
    "T12",
    "T13",
    "A01",
    "A02",
    "A03",
    "A04",
    "A05",
    "A06",
    "A07",
    "A08",
    "A09",
    "A10",
    "A11",
    "A12",
    "A13",
  ]);

  const selectedHazards: EntityRef[] = (data.hazardTypes ?? [])
    .filter((h: IHazardType) => h.selected)
    .map((h: IHazardType) => toEntityRef(h, knownHazardIds));

  const selectedCapabilities: EntityRef[] = (data.capabilities ?? []).map(
    (cap: ICapability) => cap.id,
  );

  const selectedSolutions: EntityRef[] | undefined = modes.includes("sa")
    ? (data.solutions ?? []).map((s: ISolution) => [s.id, s.label] as EntityRef)
    : undefined;

  const sessionId = state.currentSessionId ?? generateUUID();
  const baseModelHash = await hashModel(data);

  const payload: InvitePayload = {
    s: sessionId,
    v: appVersion,
    m: modes,
    fn: facilitatorName,
    fe: facilitatorEmail,
    h: selectedHazards,
    c: selectedCapabilities,
    bh: baseModelHash,
  };
  if (selectedSolutions?.length) payload.sol = selectedSolutions;
  return payload;
};

// ─── Build Patch Payload ─────────────────────────────────────────────────────

export const buildPatchPayload = (
  invite: InvitePayload,
  userName: string | undefined,
  userEmail: string | undefined,
  capabilityAnswers: CapabilityAnswer[],
  solutionCreations: CollaborationPatch["sc"],
  solutionAssessments: CollaborationPatch["sa"],
): CollaborationPatch => {
  const patch: CollaborationPatch = {
    pid: generateUUID(),
    sid: invite.s,
    bh: invite.bh,
    m: invite.m,
    at: new Date().toISOString(),
  };
  if (userName) patch.un = userName;
  if (userEmail) patch.ue = userEmail;
  if (capabilityAnswers.length) patch.ca = capabilityAnswers;
  if (solutionCreations?.length) patch.sc = solutionCreations;
  if (solutionAssessments?.length) patch.sa = solutionAssessments;
  return patch;
};

// ─── Validation ──────────────────────────────────────────────────────────────

export interface PatchValidationResult {
  valid: boolean;
  sessionMismatch: boolean;
  hashMismatch: boolean;
}

export const validatePatch = (
  patch: CollaborationPatch,
  invite: InvitePayload,
): PatchValidationResult => ({
  valid: patch.sid === invite.s,
  sessionMismatch: patch.sid !== invite.s,
  hashMismatch: patch.bh !== invite.bh,
});

// ─── Deduplication ───────────────────────────────────────────────────────────

export const deduplicatePatches = (
  patches: CollaborationPatch[],
): { unique: CollaborationPatch[]; duplicateCount: number } => {
  const seen = new Set<string>();
  const unique: CollaborationPatch[] = [];
  let duplicateCount = 0;
  for (const p of patches) {
    if (seen.has(p.pid)) {
      duplicateCount++;
    } else {
      seen.add(p.pid);
      unique.push(p);
    }
  }
  return { unique, duplicateCount };
};

const patchFingerprint = (patch: CollaborationPatch): string =>
  JSON.stringify({
    sid: patch.sid,
    bh: patch.bh,
    un: patch.un,
    ue: patch.ue,
    m: patch.m,
    ca: patch.ca ?? [],
    sc: patch.sc ?? [],
    sa: patch.sa ?? [],
  });

export const hasDuplicatePatch = (
  existingPatches: CollaborationPatch[],
  candidate: CollaborationPatch,
): boolean => {
  if (existingPatches.some((p) => p.pid === candidate.pid)) return true;
  const candidateFingerprint = patchFingerprint(candidate);
  return existingPatches.some(
    (p) => patchFingerprint(p) === candidateFingerprint,
  );
};

export const duplicatePatchReason = (
  existingPatches: CollaborationPatch[],
  candidate: CollaborationPatch,
): "id" | "content" | undefined => {
  if (existingPatches.some((p) => p.pid === candidate.pid)) return "id";
  const candidateFingerprint = patchFingerprint(candidate);
  if (
    existingPatches.some((p) => patchFingerprint(p) === candidateFingerprint)
  ) {
    return "content";
  }
  return undefined;
};

// ─── Aggregation ─────────────────────────────────────────────────────────────

/** Convert a scale ID like "Imp-3" to a numeric index for averaging. */
const scaleIdToNum = (id: string): number => {
  const m = id.match(/(\d+)$/);
  return m ? parseInt(m[1], 10) : 0;
};

const numToScaleId = (prefix: string, num: number): string =>
  `${prefix}-${Math.round(num)}`;

export const aggregateCapabilityPatches = (
  patches: CollaborationPatch[],
): AggregatedCapability[] => {
  // Group all capability answers by capabilityId
  const map = new Map<string, CapabilityAnswer[]>();
  for (const p of patches) {
    for (const ca of p.ca ?? []) {
      const list = map.get(ca.c) ?? [];
      list.push(ca);
      map.set(ca.c, list);
    }
  }

  return Array.from(map.entries()).map(([capId, answers]) => {
    const count = answers.length;

    // Average actionPriority
    const priorities = answers
      .map((a) => a.ap)
      .filter((v): v is number => v != null);
    const avgActionPriority = priorities.length
      ? priorities.reduce((s, v) => s + v, 0) / priorities.length
      : undefined;

    // Task items
    const taskItemMap = new Map<string, string[]>();
    for (const a of answers) {
      for (const item of a.ta?.i ?? []) {
        const list = taskItemMap.get(item.id) ?? [];
        if (item.v) list.push(item.v);
        taskItemMap.set(item.id, list);
      }
    }
    const taskItems = Array.from(taskItemMap.entries()).map(([id, vals]) => {
      const nums = vals.map(scaleIdToNum).filter((n) => n > 0);
      const avg = nums.length
        ? nums.reduce((s, v) => s + v, 0) / nums.length
        : 0;
      const prefix = vals[0]?.replace(/\d+$/, "").replace(/-$/, "") ?? "Imp";
      return { id, avgValue: numToScaleId(prefix, avg), allValues: vals };
    });

    // Performance items
    const perfItemMap = new Map<string, string[]>();
    for (const a of answers) {
      for (const item of a.pa?.i ?? []) {
        const list = perfItemMap.get(item.id) ?? [];
        if (item.v) list.push(item.v);
        perfItemMap.set(item.id, list);
      }
    }
    const performanceItems = Array.from(perfItemMap.entries()).map(
      ([id, vals]) => {
        const nums = vals.map(scaleIdToNum).filter((n) => n > 0);
        const avg = nums.length
          ? nums.reduce((s, v) => s + v, 0) / nums.length
          : 0;
        const prefix = vals[0]?.replace(/\d+$/, "").replace(/-$/, "") ?? "PSc";
        return { id, avgValue: numToScaleId(prefix, avg), allValues: vals };
      },
    );

    // Gap assessments
    const maxGaps = Math.max(...answers.map((a) => a.g?.length ?? 0), 0);
    const gaps: AggregatedCapability["gaps"] = [];
    for (let gi = 0; gi < maxGaps; gi++) {
      const gapItemMap = new Map<string, string[]>();
      const titleSet = new Set<string>();
      const descriptionSet = new Set<string>();
      for (const a of answers) {
        const gapAss = a.g?.[gi];
        if (!gapAss) continue;
        if (gapAss.t?.trim()) titleSet.add(gapAss.t.trim());
        if (gapAss.d?.trim()) descriptionSet.add(gapAss.d.trim());
        for (const item of gapAss.i) {
          const list = gapItemMap.get(item.id) ?? [];
          if (item.v) list.push(item.v);
          gapItemMap.set(item.id, list);
        }
      }
      gaps.push({
        gapIndex: gi,
        titles: Array.from(titleSet.values()),
        descriptions: Array.from(descriptionSet.values()),
        items: Array.from(gapItemMap.entries()).map(([id, allValues]) => ({
          id,
          allValues,
        })),
      });
    }

    return {
      capabilityId: capId,
      count,
      avgActionPriority,
      taskItems,
      performanceItems,
      gaps,
    };
  });
};

const scaleValueToNumber = (value?: string): number => {
  if (!value) return 0;
  const m = value.match(/(\d+)$/);
  return m ? parseInt(m[1], 10) : 0;
};

const overallTaskAssessmentId = (itemValues: string[]): string => {
  const scored = itemValues
    .map((v) => ({ v, n: scaleValueToNumber(v) }))
    .filter((x) => x.n > 0);
  if (!scored.length) return "";
  return scored.reduce((max, cur) => (cur.n > max.n ? cur : max)).v;
};

const overallPerformanceAssessmentId = (itemValues: string[]): string => {
  const scored = itemValues
    .map((v) => ({ v, n: scaleValueToNumber(v) }))
    .filter((x) => x.n > 0);
  if (!scored.length) return "";
  const avg =
    scored.reduce((sum, cur) => sum + cur.n, 0) / Math.max(1, scored.length);
  const rounded = Math.round(avg);
  const prefix = scored[0].v.replace(/\d+$/, "").replace(/-$/, "");
  return `${prefix}-${rounded}`;
};

const roundAverage = (values: number[]) =>
  Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);

export const mergeSolutionAssessmentPatches = (
  model: CapabilityModel,
  patches: CollaborationPatch[],
): CapabilityModel => {
  const solutions = model.data.solutions ?? [];
  if (!solutions.length || !patches.length) return model;

  const bySolutionId = new Map<string, SolutionAssessmentAnswer[]>();
  for (const patch of patches) {
    for (const assessment of patch.sa ?? []) {
      const list = bySolutionId.get(assessment.i) ?? [];
      list.push(assessment);
      bySolutionId.set(assessment.i, list);
    }
  }

  if (!bySolutionId.size) return model;

  const averageField = (
    entries: SolutionAssessmentAnswer[],
    pick: (entry: SolutionAssessmentAnswer) => number | undefined,
  ) => {
    const values = entries
      .map(pick)
      .filter((v): v is number => typeof v === "number" && !Number.isNaN(v));
    return values.length ? roundAverage(values) : undefined;
  };

  const nextSolutions: ISolution[] = solutions.map((solution) => {
    const entries = bySolutionId.get(solution.id);
    if (!entries?.length) return solution;

    const trl = averageField(entries, (entry) => entry.trl);
    const integrationRl = averageField(entries, (entry) => entry.integrationRl);
    const societalRl = averageField(entries, (entry) => entry.societalRl);
    const manufacturingRl = averageField(
      entries,
      (entry) => entry.manufacturingRl,
    );
    const commercialisationRl = averageField(
      entries,
      (entry) => entry.commercialisationRl,
    );
    const securityRl = averageField(entries, (entry) => entry.securityRl);
    const legalPrivacyEthicalRl = averageField(
      entries,
      (entry) => entry.legalPrivacyEthicalRl,
    );

    return {
      ...solution,
      ...(trl != null ? { trl } : {}),
      ...(integrationRl != null ? { integrationRl } : {}),
      ...(societalRl != null ? { societalRl } : {}),
      ...(manufacturingRl != null ? { manufacturingRl } : {}),
      ...(commercialisationRl != null ? { commercialisationRl } : {}),
      ...(securityRl != null ? { securityRl } : {}),
      ...(legalPrivacyEthicalRl != null ? { legalPrivacyEthicalRl } : {}),
    };
  });

  return {
    ...model,
    data: {
      ...model.data,
      solutions: nextSolutions,
    },
  };
};

export const mergeCapabilityAssessmentPatches = (
  model: CapabilityModel,
  patches: CollaborationPatch[],
): CapabilityModel => {
  const capabilities = model.data.capabilities ?? [];
  if (!capabilities.length || !patches.length) return model;

  const aggregated = aggregateCapabilityPatches(patches);
  if (!aggregated.length) return model;

  const byCapabilityId = new Map(aggregated.map((a) => [a.capabilityId, a]));

  const nextCapabilities = capabilities.map((cap) => {
    const agg = byCapabilityId.get(cap.id);
    if (!agg) return cap;

    const taskItems = agg.taskItems.map((i) => ({
      id: i.id,
      value: i.avgValue,
    }));
    const perfItems = agg.performanceItems.map((i) => ({
      id: i.id,
      value: i.avgValue,
    }));
    const taskAssessmentId = overallTaskAssessmentId(
      taskItems.map((i) => i.value),
    );
    const performanceAssessmentId = overallPerformanceAssessmentId(
      perfItems.map((i) => i.value),
    );

    return {
      ...cap,
      actionPriority:
        agg.avgActionPriority != null
          ? Math.max(1, Math.min(5, Math.round(agg.avgActionPriority)))
          : cap.actionPriority,
      taskAssessment: {
        assessmentId: taskAssessmentId,
        items: taskItems,
      },
      performanceAssessment: {
        assessmentId: performanceAssessmentId,
        items: perfItems,
      },
      // Gap entries are intentionally not auto-merged into model data.
      // They remain available in aggregated collaboration results for manual action.
    };
  });

  return {
    ...model,
    data: {
      ...model.data,
      capabilities: nextCapabilities,
    },
  };
};

// ─── Mailto Builders ─────────────────────────────────────────────────────────

const appBaseUrl = () => {
  const { origin, pathname } = window.location;
  return `${origin}${pathname}`;
};

const MAX_URL_LENGTH = 2000;

export const buildMailtoInvite = (
  payload: InvitePayload,
  subject: string,
  body: string,
): string => {
  const encoded = encodePayload(payload);
  const link = `${appBaseUrl()}#!collaborate?i=${encoded}`;
  const bodyWithLink =
    link.length <= MAX_URL_LENGTH
      ? `${body}\n\n${link}`
      : `${body}\n\n${link}\n\n(Full link:)\n${link}`;
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyWithLink)}`;
};

export const buildMailtoPatch = (
  patch: CollaborationPatch,
  facilitatorEmail: string,
  subject: string,
  body: string,
): string => {
  const encoded = encodePayload(patch);
  const link = `${appBaseUrl()}#!collaborate?p=${encoded}`;
  const bodyWithLink =
    link.length <= MAX_URL_LENGTH
      ? `${body}\n\n${link}`
      : `${body}\n\n${link}\n\n(Full link:)\n${link}`;
  return `mailto:${encodeURIComponent(facilitatorEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyWithLink)}`;
};
