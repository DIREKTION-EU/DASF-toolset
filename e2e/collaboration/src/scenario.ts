import {
  defaultComplianceChecks,
  defaultExpectedImpact,
  defaultOperationalNeeds,
  defaultOrganisationalNeeds,
  defaultUserNeeds,
} from "../../../packages/gui/src/models/capability-model/solution";
import {
  defaultCapabilityModel,
  getAllCapabilities,
  type CapabilityModel,
  type ICapability,
  type ISolution,
} from "../../../packages/gui/src/models/capability-model/capability-model";
import {
  buildInvitePayload,
  buildPatchPayload,
  encodePayload,
  type CapabilityAnswer,
  type CollaborationPatch,
  type CollabMode,
  type InvitePayload,
  type SolutionAssessmentAnswer,
} from "../../../packages/gui/src/services/collaboration-service";

export interface CollaborationScenarioOptions {
  baseUrl?: string;
  facilitatorName?: string;
  facilitatorEmail?: string;
  userName?: string;
  userEmail?: string;
  modes?: CollabMode[];
}

export interface CollaborationScenario {
  baseUrl: string;
  model: CapabilityModel;
  invitePayload: InvitePayload;
  inviteUrl: string;
  patchPayload: CollaborationPatch;
  patchUrl: string;
}

const DEFAULT_BASE_URL = "http://localhost:65533/";

const deepClone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const normalizeBaseUrl = (baseUrl?: string): string => {
  const url = new URL(baseUrl ?? DEFAULT_BASE_URL);
  return `${url.origin}${url.pathname.replace(/\/?$/, "/")}`;
};

const pickCapability = (model: CapabilityModel): ICapability => {
  const catalog = getAllCapabilities(model.data);
  const capability = catalog[0];
  if (!capability) {
    throw new Error("Default model does not expose any capabilities.");
  }
  return deepClone(capability);
};

const createSolution = (capabilityId: string): ISolution => ({
  id: "sol-e2e-collaboration",
  label: "E2E Collaboration Solution",
  desc: "Deterministic solution fixture used by the collaboration scripts.",
  url: "https://example.invalid/collaboration-solution",
  trl: 4,
  integrationRl: 4,
  societalRl: 3,
  manufacturingRl: 2,
  commercialisationRl: 3,
  securityRl: 5,
  legalPrivacyEthicalRl: 2,
  capabilityIds: [capabilityId],
  compliance: defaultComplianceChecks.map((item, index) => ({
    ...deepClone(item),
    value: index % 4 === 0 ? "pass" : index % 4 === 1 ? "partial" : "na",
  })),
  userNeeds: defaultUserNeeds.map((item, index) => ({
    ...deepClone(item),
    value: index % 3 === 0 ? "yes" : index % 3 === 1 ? "partially" : "unknown",
  })),
  operationalNeeds: defaultOperationalNeeds.map((item, index) => ({
    ...deepClone(item),
    value: index % 3 === 0 ? "partially" : index % 3 === 1 ? "yes" : "no",
  })),
  organisationalNeeds: defaultOrganisationalNeeds.map((item, index) => ({
    ...deepClone(item),
    value: index % 2 === 0 ? "unknown" : "no",
  })),
  expectedImpact: defaultExpectedImpact.map((item, index) => ({
    ...deepClone(item),
    value: index % 2 === 0 ? "yes" : "unknown",
  })),
});

const scaleValue = (items: Array<{ id: string }>, index: number): string => {
  if (!items.length) return "";
  return items[Math.min(index, items.length - 1)]?.id ?? items[items.length - 1].id;
};

const buildCapabilityAnswer = (
  model: CapabilityModel,
  capability: ICapability,
): CapabilityAnswer => {
  const data = model.data;
  const taskScale = data.taskScale ?? [];
  const performanceScale = data.performanceScale ?? [];
  const gapScale = data.gapScale ?? [];
  const mainTasks = data.mainTasks ?? [];
  const performanceAspects = data.performanceAspects ?? [];
  const mainGaps = data.mainGaps ?? [];

  const taskValues = mainTasks.map((task, index) => ({
    id: task.id,
    v: scaleValue(taskScale, index + 2),
    d: `Observed task evidence for ${task.label}`,
  }));

  const perfValues = performanceAspects.map((aspect, index) => ({
    id: aspect.id,
    v: scaleValue(performanceScale, index + 1),
    d: `Observed performance evidence for ${aspect.label}`,
  }));

  const gapValues = mainGaps.map((gap, index) => ({
    id: gap.id,
    v: scaleValue(gapScale, index + 1),
    d: `Gap commentary for ${gap.label}`,
  }));

  return {
    c: capability.id,
    ta: {
      a: scaleValue(taskScale, 3),
      i: taskValues,
    },
    pa: {
      a: scaleValue(performanceScale, 3),
      i: perfValues,
    },
    ap: 4,
    g: [
      {
        t: "Integration and adoption gap",
        d: "The capability needs integration work and local adoption support.",
        a: scaleValue(gapScale, Math.max(0, gapScale.length - 1)),
        i: gapValues,
        l: [
          { id: "gapSeverity", v: 4 },
          { id: "gapProbability", v: 3 },
          { id: "gapImpact", v: 4 },
        ],
      },
    ],
  };
};

const buildSolutionAssessment = (solution: ISolution): SolutionAssessmentAnswer => ({
  i: solution.id,
  trl: solution.trl ?? 4,
  integrationRl: solution.integrationRl ?? 4,
  societalRl: solution.societalRl ?? 3,
  manufacturingRl: solution.manufacturingRl ?? 2,
  commercialisationRl: solution.commercialisationRl ?? 3,
  securityRl: solution.securityRl ?? 5,
  legalPrivacyEthicalRl: solution.legalPrivacyEthicalRl ?? 2,
  imp: 4,
  n: "Promising solution with clear integration, governance, and adoption follow-up.",
});

export const createScenario = async (
  options: CollaborationScenarioOptions = {},
): Promise<CollaborationScenario> => {
  const baseUrl = normalizeBaseUrl(options.baseUrl);
  const facilitatorName = options.facilitatorName ?? "Facilitator One";
  const facilitatorEmail = options.facilitatorEmail ?? "facilitator@example.com";
  const userName = options.userName ?? "User One";
  const userEmail = options.userEmail ?? "user@example.com";
  const modes = options.modes ?? ["ca", "sa"];

  const model = deepClone(defaultCapabilityModel());
  const capability = pickCapability(model);
  model.data.capabilities = [capability];

  const solution = createSolution(capability.id);
  model.data.solutions = [solution];

  const invitePayload = await buildInvitePayload(
    { catModel: model } as any,
    modes,
    facilitatorName,
    facilitatorEmail,
    model.data.title ?? "1.0",
  );
  const inviteUrl = `${baseUrl}#!collaborate?i=${encodePayload(invitePayload)}`;

  const patchPayload = buildPatchPayload(
    invitePayload,
    userName,
    userEmail,
    [buildCapabilityAnswer(model, capability)],
    [],
    [buildSolutionAssessment(solution)],
  );
  const patchUrl = `${baseUrl}#!collaborate?p=${encodePayload(patchPayload)}`;

  return {
    baseUrl,
    model,
    invitePayload,
    inviteUrl,
    patchPayload,
    patchUrl,
  };
};

export const printScenario = (scenario: CollaborationScenario) => {
  const output = {
    baseUrl: scenario.baseUrl,
    inviteUrl: scenario.inviteUrl,
    patchUrl: scenario.patchUrl,
    invitePayload: scenario.invitePayload,
    patchPayload: scenario.patchPayload,
  };

  console.log(JSON.stringify(output, null, 2));
};