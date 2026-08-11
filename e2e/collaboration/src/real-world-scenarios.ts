import {
  defaultComplianceChecks,
  defaultExpectedImpact,
  defaultOperationalNeeds,
  defaultOrganisationalNeeds,
  defaultUserNeeds,
  type ISolution,
} from "../../../packages/gui/src/models/capability-model/solution";
import {
  defaultCapabilityModel,
  getAllCapabilities,
  type CapabilityModel,
  type ICapability,
} from "../../../packages/gui/src/models/capability-model/capability-model";
import {
  defaultHazardTypes,
  type IHazardType,
} from "../../../packages/gui/src/models/capability-model/hazard";
import {
  aggregateCapabilityPatches,
  buildInvitePayload,
  buildPatchPayload,
  encodePayload,
  mergeCapabilityAssessmentPatches,
  mergeSolutionAssessmentPatches,
  type CapabilityAnswer,
  type CollaborationPatch,
  type CollabMode,
  type InvitePayload,
  type SolutionAssessmentAnswer,
} from "../../../packages/gui/src/services/collaboration-service";

type UserConfig = {
  name: string;
  email: string;
  canSuggestSolutions?: boolean;
};

type FacilitatorConfig = {
  id: string;
  name: string;
  email: string;
  userCount: number;
  capabilityCount: number;
  hazardIds: string[];
  solutionCount: number;
  allowUserSuggestedSolutions: boolean;
  modes: CollabMode[];
  capabilityOffset: number;
};

type UserRun = {
  user: UserConfig;
  patchUrl: string;
  patch: CollaborationPatch;
};

type FacilitatorRun = {
  facilitator: {
    id: string;
    name: string;
    email: string;
  };
  inviteUrl: string;
  invitePayload: InvitePayload;
  selectedHazards: IHazardType[];
  selectedCapabilities: ICapability[];
  facilitatorSolutions: ISolution[];
  userRuns: UserRun[];
  mergedModel: CapabilityModel;
  capabilityAggregation: ReturnType<typeof aggregateCapabilityPatches>;
  facilitatorOverride: {
    capabilityId?: string;
    taskItemId?: string;
    consensusValue?: string;
    finalValue?: string;
    note?: string;
  };
};

export type RealWorldScenarioOutput = {
  baseUrl: string;
  generatedAt: string;
  facilitators: FacilitatorRun[];
};

const DEFAULT_BASE_URL = "http://localhost:65533/";

const deepClone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const normalizeBaseUrl = (baseUrl?: string): string => {
  const url = new URL(baseUrl ?? DEFAULT_BASE_URL);
  return `${url.origin}${url.pathname.replace(/\/?$/, "/")}`;
};

const scaleValue = (items: Array<{ id: string }>, index: number): string => {
  if (!items.length) return "";
  return items[Math.min(index, items.length - 1)]?.id ?? items[items.length - 1].id;
};

const createUsers = (facilitatorId: string, count: number): UserConfig[] =>
  Array.from({ length: count }, (_, index) => ({
    name: `${facilitatorId.toUpperCase()} User ${index + 1}`,
    email: `${facilitatorId}.user${index + 1}@example.com`,
  }));

const selectCapabilities = (
  model: CapabilityModel,
  capabilityCount: number,
  offset: number,
) => {
  const catalog = getAllCapabilities(model.data);
  if (!catalog.length) {
    throw new Error("Default model does not expose capabilities.");
  }
  const start = Math.min(offset, Math.max(0, catalog.length - capabilityCount));
  return catalog.slice(start, start + capabilityCount).map((cap) => deepClone(cap));
};

const selectHazards = (hazardIds: string[]): IHazardType[] =>
  defaultHazardTypes
    .filter((hazard) => hazardIds.includes(hazard.id))
    .map((hazard) => ({
      ...deepClone(hazard),
      selected: true,
      description: `${hazard.label} selected by facilitator for this workshop scenario.`,
    }));

const makeSolution = (
  facilitatorId: string,
  capabilityIds: string[],
  index: number,
): ISolution => ({
  id: `${facilitatorId}-sol-${index + 1}`,
  label: `${facilitatorId.toUpperCase()} Solution ${index + 1}`,
  desc: `Prepared facilitator candidate solution ${index + 1}.`,
  url: `https://example.invalid/${facilitatorId}/solution-${index + 1}`,
  trl: 3 + (index % 3),
  integrationRl: 3 + (index % 4),
  societalRl: 2 + (index % 4),
  manufacturingRl: 2 + (index % 3),
  commercialisationRl: 2 + (index % 4),
  securityRl: 4 + (index % 4),
  legalPrivacyEthicalRl: 1 + (index % 3),
  capabilityIds: capabilityIds.slice(0, Math.max(1, Math.min(capabilityIds.length, 2))),
  compliance: defaultComplianceChecks.map((item, i) => ({
    ...deepClone(item),
    value: i % 3 === 0 ? "pass" : i % 3 === 1 ? "partial" : "unknown",
  })) as any,
  userNeeds: defaultUserNeeds.map((item, i) => ({
    ...deepClone(item),
    value: i % 3 === 0 ? "yes" : i % 3 === 1 ? "partially" : "unknown",
  })),
  operationalNeeds: defaultOperationalNeeds.map((item, i) => ({
    ...deepClone(item),
    value: i % 3 === 0 ? "partially" : i % 3 === 1 ? "yes" : "no",
  })),
  organisationalNeeds: defaultOrganisationalNeeds.map((item, i) => ({
    ...deepClone(item),
    value: i % 2 === 0 ? "unknown" : "no",
  })),
  expectedImpact: defaultExpectedImpact.map((item, i) => ({
    ...deepClone(item),
    value: i % 2 === 0 ? "yes" : "unknown",
  })),
});

const buildCapabilityAnswer = (
  model: CapabilityModel,
  capability: ICapability,
  userIndex: number,
): CapabilityAnswer => {
  const data = model.data;
  const taskScale = data.taskScale ?? [];
  const performanceScale = data.performanceScale ?? [];
  const gapScale = data.gapScale ?? [];
  const mainTasks = data.mainTasks ?? [];
  const performanceAspects = data.performanceAspects ?? [];
  const mainGaps = data.mainGaps ?? [];

  const taskItems = mainTasks.map((task, index) => ({
    id: task.id,
    v: scaleValue(taskScale, 1 + ((userIndex + index) % Math.max(1, taskScale.length))),
    d: `${task.label} feedback from participant ${userIndex + 1}`,
  }));

  const performanceItems = performanceAspects.map((aspect, index) => ({
    id: aspect.id,
    v: scaleValue(
      performanceScale,
      1 + ((userIndex + index + 1) % Math.max(1, performanceScale.length)),
    ),
    d: `${aspect.label} feedback from participant ${userIndex + 1}`,
  }));

  const gapItems = mainGaps.map((gap, index) => ({
    id: gap.id,
    v: scaleValue(gapScale, 1 + ((userIndex + index) % Math.max(1, gapScale.length))),
    d: `${gap.label} gap note from participant ${userIndex + 1}`,
  }));

  return {
    c: capability.id,
    ta: {
      a: scaleValue(taskScale, 2 + (userIndex % 2)),
      i: taskItems,
    },
    pa: {
      a: scaleValue(performanceScale, 2 + (userIndex % 2)),
      i: performanceItems,
    },
    ap: 2 + ((userIndex + capability.id.length) % 4),
    g: [
      {
        t: `${capability.label} adoption gap`,
        d: `Participants indicate deployment friction in field operations for ${capability.label}.`,
        a: scaleValue(gapScale, Math.max(0, gapScale.length - 1)),
        i: gapItems,
        l: [
          { id: "gapSeverity", v: 2 + (userIndex % 3) },
          { id: "gapProbability", v: 2 + ((userIndex + 1) % 3) },
          { id: "gapImpact", v: 3 + (userIndex % 2) },
        ],
      },
    ],
  };
};

const buildSolutionAssessments = (
  solutions: ISolution[],
  userIndex: number,
): SolutionAssessmentAnswer[] =>
  solutions.map((solution, index) => ({
    i: solution.id,
    trl: Math.max(1, Math.min(9, (solution.trl ?? 3) + (userIndex % 2))),
    integrationRl: Math.max(
      1,
      Math.min(9, (solution.integrationRl ?? 3) + ((userIndex + index) % 2)),
    ),
    societalRl: Math.max(
      1,
      Math.min(9, (solution.societalRl ?? 2) + ((userIndex + 1) % 2)),
    ),
    manufacturingRl: Math.max(
      1,
      Math.min(9, (solution.manufacturingRl ?? 2) + (userIndex % 2)),
    ),
    commercialisationRl: Math.max(
      1,
      Math.min(9, (solution.commercialisationRl ?? 2) + ((userIndex + index) % 2)),
    ),
    securityRl: Math.max(1, Math.min(10, (solution.securityRl ?? 4) + (userIndex % 2))),
    legalPrivacyEthicalRl: Math.max(
      1,
      Math.min(4, (solution.legalPrivacyEthicalRl ?? 1) + ((userIndex + index) % 2)),
    ),
    imp: 2 + ((userIndex + index) % 3),
    n: `Participant ${userIndex + 1} assessment for ${solution.label}`,
  }));

const buildSuggestedSolutions = (
  facilitatorId: string,
  selectedCapabilities: ICapability[],
  user: UserConfig,
  userIndex: number,
) => {
  const baseCapabilityId = selectedCapabilities[userIndex % selectedCapabilities.length]?.id;
  if (!baseCapabilityId) return [];
  return [
    {
      i: [
        `${facilitatorId}-user-suggested-${userIndex + 1}`,
        `${user.name} Suggested Solution`,
        `Proposed by ${user.name} to target local operational constraints.`,
      ] as [string, string, string],
      trl: 2 + (userIndex % 3),
      ci: [baseCapabilityId],
    },
  ];
};

const applyFacilitatorOverride = (
  mergedModel: CapabilityModel,
  capabilityAggregation: ReturnType<typeof aggregateCapabilityPatches>,
) => {
  const firstCapability = mergedModel.data.capabilities?.[0];
  const firstTaskItem = firstCapability?.taskAssessment?.items?.[0];
  if (!firstCapability || !firstTaskItem) {
    return {
      capabilityId: undefined,
      taskItemId: undefined,
      consensusValue: undefined,
      finalValue: undefined,
      note: undefined,
    };
  }

  const consensusCapability = capabilityAggregation.find(
    (entry) => entry.capabilityId === firstCapability.id,
  );
  const consensusValue = consensusCapability?.taskItems.find(
    (entry) => entry.id === firstTaskItem.id,
  )?.avgValue;

  const taskScale = mergedModel.data.taskScale ?? [];
  const consensusIndex = taskScale.findIndex((entry) => entry.id === consensusValue);
  const overrideValue =
    consensusIndex >= 0 && consensusIndex < taskScale.length - 1
      ? taskScale[consensusIndex + 1].id
      : taskScale[Math.max(0, consensusIndex - 1)]?.id || firstTaskItem.value;

  firstTaskItem.value = overrideValue;
  firstCapability.consensusJustifications = {
    ...(firstCapability.consensusJustifications ?? {}),
    [`task:${firstTaskItem.id}`]:
      "Facilitator override: operational planning horizon requires a stricter readiness threshold than workshop consensus.",
  };

  return {
    capabilityId: firstCapability.id,
    taskItemId: firstTaskItem.id,
    consensusValue,
    finalValue: overrideValue,
    note:
      firstCapability.consensusJustifications[`task:${firstTaskItem.id}`],
  };
};

const createFacilitatorRun = async (
  baseUrl: string,
  config: FacilitatorConfig,
): Promise<FacilitatorRun> => {
  const model = deepClone(defaultCapabilityModel());
  const selectedCapabilities = selectCapabilities(
    model,
    config.capabilityCount,
    config.capabilityOffset,
  );
  const selectedHazards = selectHazards(config.hazardIds);
  const facilitatorSolutions = Array.from({ length: config.solutionCount }, (_, index) =>
    makeSolution(
      config.id,
      selectedCapabilities.map((cap) => cap.id),
      index,
    ),
  );

  model.data.capabilities = selectedCapabilities;
  model.data.hazardTypes = selectedHazards;
  model.data.selectedHazardIds = selectedHazards.map((hazard) => hazard.id);
  model.data.solutions = facilitatorSolutions;

  const invitePayload = await buildInvitePayload(
    { catModel: model } as any,
    config.modes,
    config.name,
    config.email,
    model.data.title ?? "1.0",
  );
  const inviteUrl = `${baseUrl}#!collaborate?i=${encodePayload(invitePayload)}`;

  const users = createUsers(config.id, config.userCount).map((user, index) => ({
    ...user,
    canSuggestSolutions: config.allowUserSuggestedSolutions && index % 2 === 0,
  }));

  const userRuns: UserRun[] = users.map((user, userIndex) => {
    const capabilityAnswers = selectedCapabilities.map((capability) =>
      buildCapabilityAnswer(model, capability, userIndex),
    );
    const solutionAssessments = buildSolutionAssessments(
      facilitatorSolutions,
      userIndex,
    );
    const suggestedSolutions =
      user.canSuggestSolutions && config.allowUserSuggestedSolutions
        ? buildSuggestedSolutions(config.id, selectedCapabilities, user, userIndex)
        : [];

    const patch = buildPatchPayload(
      invitePayload,
      user.name,
      user.email,
      capabilityAnswers,
      suggestedSolutions,
      solutionAssessments,
    );

    return {
      user,
      patch,
      patchUrl: `${baseUrl}#!collaborate?p=${encodePayload(patch)}`,
    };
  });

  const patches = userRuns.map((run) => run.patch);
  const mergedCapabilityModel = mergeCapabilityAssessmentPatches(model, patches);
  const mergedModel = mergeSolutionAssessmentPatches(mergedCapabilityModel, patches);
  const capabilityAggregation = aggregateCapabilityPatches(patches);
  const facilitatorOverride = applyFacilitatorOverride(
    mergedModel,
    capabilityAggregation,
  );

  return {
    facilitator: {
      id: config.id,
      name: config.name,
      email: config.email,
    },
    inviteUrl,
    invitePayload,
    selectedHazards,
    selectedCapabilities,
    facilitatorSolutions,
    userRuns,
    mergedModel,
    capabilityAggregation,
    facilitatorOverride,
  };
};

export const createRealWorldCollaborationScenarios = async (
  baseUrl?: string,
): Promise<RealWorldScenarioOutput> => {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  const facilitatorConfigs: FacilitatorConfig[] = [
    {
      id: "alpha",
      name: "Facilitator Alpha",
      email: "facilitator.alpha@example.com",
      userCount: 3,
      capabilityCount: 3,
      hazardIds: ["N05", "N07", "T10", "A03"],
      solutionCount: 4,
      allowUserSuggestedSolutions: false,
      modes: ["ca", "sa"],
      capabilityOffset: 1,
    },
    {
      id: "bravo",
      name: "Facilitator Bravo",
      email: "facilitator.bravo@example.com",
      userCount: 7,
      capabilityCount: 4,
      hazardIds: ["N11", "T01", "T12", "A05", "A11"],
      solutionCount: 3,
      allowUserSuggestedSolutions: true,
      modes: ["ca", "sa", "sc"],
      capabilityOffset: 8,
    },
  ];

  const facilitators = [] as FacilitatorRun[];
  for (const config of facilitatorConfigs) {
    facilitators.push(await createFacilitatorRun(normalizedBaseUrl, config));
  }

  return {
    baseUrl: normalizedBaseUrl,
    generatedAt: new Date().toISOString(),
    facilitators,
  };
};

export const printRealWorldScenario = (scenario: RealWorldScenarioOutput) => {
  console.log(JSON.stringify(scenario, null, 2));
};