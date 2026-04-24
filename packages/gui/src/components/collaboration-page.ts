/**
 * Collaboration Page
 *
 * Facilitator view (default):
 *   A) Send Invite — choose modes, enter name/email, generate mailto
 *   B) Received Patches — load from URL ?p=, view aggregated results
 *
 * User view (when URL contains ?i=<encoded-invite>):
 *   Fill in capability assessments and click Done to send patch back.
 */
import m from "mithril";
import { ConfirmButton, ThemeToggle } from "mithril-materialized";
import { actions, MeiosisComponent, sessionService, t } from "../services";
import { Pages } from "../models/page";
import { type Languages, i18n } from "../services";
import { LanguageSwitcher } from "./ui/language-switcher";
import type { ICapability } from "../models/capability-model/capability-model";
import type { ISolution } from "../models/capability-model/solution";
import { allSolutionReadinessConfigs } from "../models/capability-model/readiness-levels";
import {
  type CollabMode,
  type CapabilityAnswer,
  type CollaborationPatch,
  type InvitePayload,
  type SolutionAssessmentAnswer,
  buildInvitePayload,
  buildMailtoInvite,
  buildMailtoPatch,
  buildPatchPayload,
  decodePayload,
  aggregateCapabilityPatches,
  mergeCapabilityAssessmentPatches,
  mergeSolutionAssessmentPatches,
  entityId,
  entityLabel,
} from "../services/collaboration-service";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MODES: { id: CollabMode; label: () => string }[] = [
  { id: "ca", label: () => t("collab_mode_ca") },
  { id: "sc", label: () => t("collab_mode_sc") },
  { id: "sa", label: () => t("collab_mode_sa") },
];

const capabilityFromInvite = (
  capRef: InvitePayload["c"][number],
  allCaps: ICapability[],
): ICapability | undefined => {
  const id = entityId(capRef);
  return allCaps.find((c) => c.id === id);
};

const inviteDraftKey = (invite: InvitePayload): string =>
  `${invite.s}:${invite.bh}`;

const stringifyTranslation = (value: unknown) =>
  Array.isArray(value) ? value.join("") : value == null ? "" : `${value}`;

const translatedOrFallback = (key: string, fallback: string) => {
  const translated = stringifyTranslation(t(key as any));
  return translated && translated !== key && translated !== `@@${key}@@`
    ? translated
    : fallback;
};

const aggregateSolutionAssessments = (
  patches: CollaborationPatch[],
  solutions: ISolution[],
) => {
  const bySolutionId = new Map<string, SolutionAssessmentAnswer[]>();

  for (const patch of patches) {
    for (const assessment of patch.sa ?? []) {
      const list = bySolutionId.get(assessment.i) ?? [];
      list.push(assessment);
      bySolutionId.set(assessment.i, list);
    }
  }

  return Array.from(bySolutionId.entries()).map(([solutionId, entries]) => {
    const solution = solutions.find((item) => item.id === solutionId);
    const readiness = allSolutionReadinessConfigs
      .map((config) => {
        const values = entries
          .map((entry) => entry[config.id as keyof SolutionAssessmentAnswer])
          .filter(
            (value): value is number =>
              typeof value === "number" && !Number.isNaN(value),
          );

        if (!values.length) return undefined;

        const average =
          values.reduce((sum, value) => sum + value, 0) / values.length;
        return {
          id: config.id,
          label: translatedOrFallback(config.labelKey, config.fallbackLabel),
          prefix: config.prefix,
          average,
          values,
        };
      })
      .filter((item): item is NonNullable<typeof item> => !!item);

    const impactValues = entries
      .map((entry) => entry.imp)
      .filter(
        (value): value is number =>
          typeof value === "number" && !Number.isNaN(value),
      );
    const notes = entries
      .map((entry) => entry.n?.trim())
      .filter((note): note is string => !!note);

    return {
      solutionId,
      label: solution?.label ?? solutionId,
      count: entries.length,
      readiness,
      impactValues,
      impactAverage: impactValues.length
        ? impactValues.reduce((sum, value) => sum + value, 0) /
          impactValues.length
        : undefined,
      notes,
    };
  });
};

// ─── Facilitator View ─────────────────────────────────────────────────────────

const FacilitatorSendInvite: MeiosisComponent = () => {
  let sending = false;

  return {
    view: ({ attrs }) => {
      const { collaboration = {}, catModel } = attrs.state;
      const { modes = [], facilitatorInfo = {} } = collaboration;
      const data = catModel?.data ?? {};

      const toggleMode = (mode: CollabMode) => {
        const next = modes.includes(mode)
          ? modes.filter((m) => m !== mode)
          : [...modes, mode];
        actions.updateCollaboration(attrs, { modes: next });
      };

      const send = async () => {
        if (!facilitatorInfo.name || !facilitatorInfo.email || !modes.length)
          return;
        sending = true;
        try {
          const payload = await buildInvitePayload(
            attrs.state,
            modes,
            facilitatorInfo.name,
            facilitatorInfo.email,
            data.title ?? "1.0",
          );
          actions.updateCollaboration(attrs, {
            sessionId: payload.s,
            baseModelHash: payload.bh,
          });
          const subject = t("collab_invite_subject");
          const body = t("collab_invite_body").replace(
            /\{facilitatorName\}/g,
            facilitatorInfo.name,
          );
          const mailto = buildMailtoInvite(payload, subject, body);
          window.location.href = mailto;
        } finally {
          sending = false;
          m.redraw();
        }
      };

      return m(".collab-send-invite", [
        m("h5", t("collab_send_invite")),

        // Mode chips
        m(".collab-modes.row", [
          m(".col.s12", m("label", t("collab_select_modes"))),
          ...MODES.map((mode) =>
            m(
              ".chip",
              {
                class: modes.includes(mode.id) ? "teal white-text" : "",
                style: "cursor:pointer; margin:4px",
                onclick: () => toggleMode(mode.id),
              },
              mode.label(),
            ),
          ),
        ]),

        // Facilitator info
        m(".row", [
          m(".col.s12.m6", [
            m("label", t("collab_facilitator_name")),
            m("input[type=text]", {
              value: facilitatorInfo.name ?? "",
              oninput: (e: Event) =>
                actions.updateCollaboration(attrs, {
                  facilitatorInfo: {
                    ...facilitatorInfo,
                    name: (e.target as HTMLInputElement).value,
                  },
                }),
            }),
          ]),
          m(".col.s12.m6", [
            m("label", t("collab_facilitator_email")),
            m("input[type=email]", {
              value: facilitatorInfo.email ?? "",
              oninput: (e: Event) =>
                actions.updateCollaboration(attrs, {
                  facilitatorInfo: {
                    ...facilitatorInfo,
                    email: (e.target as HTMLInputElement).value,
                  },
                }),
            }),
          ]),
        ]),

        // Send button
        m(
          "button.btn.waves-effect.waves-light.teal",
          {
            disabled:
              sending ||
              !facilitatorInfo.name ||
              !facilitatorInfo.email ||
              !modes.length,
            onclick: send,
          },
          [m("i.material-icons.left", "send"), t("collab_generate_link")],
        ),
      ]);
    },
  };
};

// ─── Patch Loader ─────────────────────────────────────────────────────────────

const PatchLoader: MeiosisComponent = () => {
  let pasteValue = "";
  let errorMsg = "";
  let ignoredReason: "id" | "content" | undefined;

  const tryLoadPatch = async (
    attrs: Parameters<ReturnType<MeiosisComponent>["view"]>[0]["attrs"],
    encoded: string,
  ) => {
    try {
      const patch = decodePayload<CollaborationPatch>(encoded);
      const { collaboration = {} } = attrs.getState();
      const invite = collaboration.invitePayload;

      // If the patch belongs to another saved session, restore that model first.
      if (attrs.state.currentSessionId !== patch.sid) {
        const matchingSession = await sessionService.getSession(patch.sid);
        if (matchingSession?.model) {
          actions.update(attrs, {
            currentSessionId: matchingSession.id,
            catModel: matchingSession.model,
            model: matchingSession.model,
          });
        }
      }

      if (invite && patch.sid !== invite.s) {
        errorMsg = t("collab_session_mismatch");
        return;
      }
      if (invite && patch.bh !== invite.bh) {
        errorMsg = t("collab_hash_mismatch");
        // Still load it, just warn
      }

      const addResult = actions.addPatch(attrs, patch);
      if (!addResult.added) {
        ignoredReason = addResult.reason;
        errorMsg = t("collab_duplicate_ignored");
        return;
      }

      ignoredReason = undefined;

      const nextState = attrs.getState();
      const mergedCapabilityModel =
        nextState.catModel && nextState.collaboration?.patches
          ? mergeCapabilityAssessmentPatches(
              nextState.catModel,
              nextState.collaboration.patches,
            )
          : undefined;

      const mergedModel =
        mergedCapabilityModel && nextState.collaboration?.patches
          ? mergeSolutionAssessmentPatches(
              mergedCapabilityModel,
              nextState.collaboration.patches,
            )
          : mergedCapabilityModel;

      if (mergedModel) {
        actions.saveModel(attrs, mergedModel);
      }

      pasteValue = "";
      errorMsg = "";
    } catch {
      ignoredReason = undefined;
      errorMsg = "Invalid patch link — could not decode.";
    }
    m.redraw();
  };

  return {
    oninit: ({ attrs }) => {
      // Auto-load from URL ?p= param
      const pParam = m.route.param("p");
      if (pParam) void tryLoadPatch(attrs, pParam);
    },
    view: ({ attrs }) => {
      const { collaboration = {} } = attrs.state;
      const patches = collaboration.patches ?? [];

      return m(".collab-patch-loader", [
        m("h5", t("collab_load_patch")),

        // Paste input
        m(".row", [
          m(".col.s12.m9", [
            m("label", t("collab_paste_patch")),
            m("input[type=text]", {
              value: pasteValue,
              oninput: (e: Event) => {
                pasteValue = (e.target as HTMLInputElement).value;
                errorMsg = "";
              },
            }),
          ]),
          m(".col.s12.m3", { style: "padding-top:26px" }, [
            m(
              "button.btn.waves-effect.waves-light",
              {
                disabled: !pasteValue.trim(),
                onclick: async () => {
                  // Extract encoded param from pasted URL or raw encoded string
                  const match = pasteValue.match(/[?&]p=([^&\s]+)/);
                  await tryLoadPatch(
                    attrs,
                    match ? match[1] : pasteValue.trim(),
                  );
                },
              },
              t("collab_load_patch_btn"),
            ),
          ]),
        ]),

        errorMsg && m(".red-text.col.s12", m("small", errorMsg)),
        ignoredReason &&
          m(
            ".col.s12",
            m(".chip.orange.lighten-4.black-text", [
              m("i.material-icons.tiny", "block"),
              " ",
              ignoredReason === "id"
                ? "Ignored duplicate patch (same patch id)."
                : "Ignored duplicate patch (same content).",
            ]),
          ),

        // Patch list
        patches.length === 0
          ? m("p.grey-text", t("collab_no_patches"))
          : [
              m("p", t("collab_patches_count", patches.length)),
              m("table.highlight", [
                m(
                  "thead",
                  m("tr", [
                    m("th", t("collab_contributor")),
                    m("th", t("collab_received_at")),
                    m("th", t("collab_mode_ca")),
                    m("th", ""),
                  ]),
                ),
                m(
                  "tbody",
                  patches.map((p) =>
                    m("tr", [
                      m(
                        "td",
                        p.un ? `${p.un} (${p.ue ?? "?"})` : (p.ue ?? "—"),
                      ),
                      m("td", new Date(p.at).toLocaleString()),
                      m("td", p.m.join(", ")),
                      m(
                        "td",
                        m(
                          "a.red-text",
                          {
                            style: "cursor:pointer",
                            onclick: () => {
                              actions.removePatch(attrs, p.pid);
                              const nextState = attrs.getState();
                              if (
                                nextState.catModel &&
                                nextState.collaboration?.patches
                              ) {
                                const mergedCapabilityModel =
                                  mergeCapabilityAssessmentPatches(
                                    nextState.catModel,
                                    nextState.collaboration.patches,
                                  );
                                const mergedModel =
                                  mergeSolutionAssessmentPatches(
                                    mergedCapabilityModel,
                                    nextState.collaboration.patches,
                                  );
                                actions.saveModel(attrs, mergedModel);
                              }
                            },
                          },
                          [
                            m("i.material-icons.tiny", "delete"),
                            " ",
                            t("collab_remove_patch"),
                          ],
                        ),
                      ),
                    ]),
                  ),
                ),
              ]),
              m(AggregatedResults, { ...attrs }),
            ],
      ]);
    },
  };
};

// ─── Aggregated Results Panel ─────────────────────────────────────────────────

const AggregatedResults: MeiosisComponent = () => ({
  view: ({ attrs }) => {
    const patches = attrs.state.collaboration?.patches ?? [];
    if (!patches.length) return null;

    const capabilityAgg = aggregateCapabilityPatches(patches);
    const allSolutions = attrs.state.catModel?.data?.solutions ?? [];
    const solutionAgg = aggregateSolutionAssessments(patches, allSolutions);
    if (!capabilityAgg.length && !solutionAgg.length) return null;

    return m(".collab-aggregated", [
      m("h6", t("collab_aggregated_results")),
      capabilityAgg.length > 0 &&
        m("table.striped.highlight", [
          m(
            "thead",
            m("tr", [
              m("th", t("cap")),
              m("th", t("collab_avg_action_priority")),
              m("th", t("collab_task_items")),
              m("th", t("collab_perf_items")),
              m("th", t("collab_gap_items")),
            ]),
          ),
          m(
            "tbody",
            capabilityAgg.map((a) =>
              m("tr", [
                m("td", m("code", a.capabilityId)),
                m(
                  "td",
                  a.avgActionPriority != null
                    ? a.avgActionPriority.toFixed(1)
                    : "—",
                ),
                m(
                  "td",
                  a.taskItems.map((ti) =>
                    m("div", [
                      m("small.grey-text", `${ti.id}: `),
                      m("strong", ti.avgValue),
                      m("small.grey-text", ` (${ti.allValues.join(", ")})`),
                    ]),
                  ),
                ),
                m(
                  "td",
                  a.performanceItems.map((pi) =>
                    m("div", [
                      m("small.grey-text", `${pi.id}: `),
                      m("strong", pi.avgValue),
                      m("small.grey-text", ` (${pi.allValues.join(", ")})`),
                    ]),
                  ),
                ),
                m(
                  "td",
                  a.gaps.map((g) =>
                    m("div", { style: "margin-bottom:8px" }, [
                      m(
                        "small.grey-text",
                        `${t("gap")} ${g.gapIndex + 1}${g.titles.length ? `: ${g.titles.join(" | ")}` : ""}`,
                      ),
                      ...g.items.map((gi) =>
                        m("div", [
                          m("small.grey-text", `${gi.id}: `),
                          m("small", gi.allValues.join(", ") || "—"),
                        ]),
                      ),
                    ]),
                  ),
                ),
              ]),
            ),
          ),
        ]),
      solutionAgg.length > 0 && [
        m("h6", t("solutions")),
        m("table.striped.highlight", [
          m(
            "thead",
            m("tr", [
              m("th", t("solution")),
              m("th", t("collab_contributor")),
              m("th", t("value")),
              m("th", t("sol_expected_impact_title")),
              m("th", t("desc")),
            ]),
          ),
          m(
            "tbody",
            solutionAgg.map((solution) =>
              m("tr", [
                m("td", solution.label),
                m("td", solution.count),
                m(
                  "td",
                  solution.readiness.length > 0
                    ? solution.readiness.map((item) =>
                        m("div", [
                          m("small.grey-text", `${item.label}: `),
                          m(
                            "strong",
                            `${item.prefix} ${item.average.toFixed(1)}`,
                          ),
                          m("small.grey-text", ` (${item.values.join(", ")})`),
                        ]),
                      )
                    : "—",
                ),
                m(
                  "td",
                  solution.impactAverage != null
                    ? m("div", [
                        m("strong", solution.impactAverage.toFixed(1)),
                        m(
                          "small.grey-text",
                          ` (${solution.impactValues.join(", ")})`,
                        ),
                      ])
                    : "—",
                ),
                m(
                  "td",
                  solution.notes.length > 0
                    ? solution.notes.map((note) => m("div", note))
                    : "—",
                ),
              ]),
            ),
          ),
        ]),
      ],
    ]);
  },
});

// ─── User View ────────────────────────────────────────────────────────────────

const UserAssessmentView: MeiosisComponent = () => {
  // Local mutable answers keyed by capabilityId
  const answers = new Map<string, CapabilityAnswer>();
  const solutionAssessments = new Map<string, SolutionAssessmentAnswer>();
  let pageIndex = 0;
  let loadedDraftKey = "";

  const serializeAnswers = (): CapabilityAnswer[] =>
    Array.from(answers.values()).map((a) => ({
      ...a,
      ta: a.ta ? { a: a.ta.a, i: a.ta.i.map((x) => ({ ...x })) } : undefined,
      pa: a.pa ? { a: a.pa.a, i: a.pa.i.map((x) => ({ ...x })) } : undefined,
      g: a.g
        ? a.g.map((g) => ({
            t: g.t,
            d: g.d,
            a: g.a,
            i: g.i.map((x) => ({ ...x })),
          }))
        : undefined,
    }));

  const serializeSolutionAssessments = (): SolutionAssessmentAnswer[] =>
    Array.from(solutionAssessments.values()).map((item) => ({ ...item }));

  const persistDraft = (
    attrs: Parameters<ReturnType<MeiosisComponent>["view"]>[0]["attrs"],
    invite: InvitePayload,
  ) => {
    const key = inviteDraftKey(invite);
    const drafts = attrs.state.collaboration?.userDrafts ?? {};
    actions.updateCollaboration(attrs, {
      userDrafts: {
        ...drafts,
        [key]: {
          answers: serializeAnswers(),
          solutionAssessments: serializeSolutionAssessments(),
          pageIndex,
          updatedAt: Date.now(),
        },
      },
    });
  };

  const restoreDraft = (
    attrs: Parameters<ReturnType<MeiosisComponent>["view"]>[0]["attrs"],
    invite: InvitePayload,
  ) => {
    const key = inviteDraftKey(invite);
    if (loadedDraftKey === key) return;
    loadedDraftKey = key;
    answers.clear();
    solutionAssessments.clear();
    pageIndex = 0;
    const draft = attrs.state.collaboration?.userDrafts?.[key];
    if (!draft) return;
    (draft.answers ?? []).forEach((a) => {
      answers.set(a.c, {
        ...a,
        ta: a.ta ? { a: a.ta.a, i: a.ta.i.map((x) => ({ ...x })) } : undefined,
        pa: a.pa ? { a: a.pa.a, i: a.pa.i.map((x) => ({ ...x })) } : undefined,
        g: a.g
          ? a.g.map((g) => ({
              t: g.t,
              d: g.d,
              a: g.a,
              i: g.i.map((x) => ({ ...x })),
            }))
          : undefined,
      });
    });
    (draft.solutionAssessments ?? []).forEach((item) => {
      solutionAssessments.set(item.i, { ...item });
    });
    pageIndex = Math.max(0, draft.pageIndex ?? 0);
  };

  const getOrCreate = (capId: string): CapabilityAnswer => {
    if (!answers.has(capId)) answers.set(capId, { c: capId });
    return answers.get(capId)!;
  };

  const setTaskItem = (capId: string, itemId: string, value: string) => {
    const a = getOrCreate(capId);
    a.ta = a.ta ?? { a: "", i: [] };
    const existing = a.ta.i.find((x) => x.id === itemId);
    if (existing) existing.v = value;
    else a.ta.i.push({ id: itemId, v: value });
  };

  const setTaskDesc = (capId: string, itemId: string, desc: string) => {
    const a = getOrCreate(capId);
    a.ta = a.ta ?? { a: "", i: [] };
    const existing = a.ta.i.find((x) => x.id === itemId);
    if (existing) existing.d = desc;
    else a.ta.i.push({ id: itemId, d: desc });
  };

  const setPerfItem = (capId: string, itemId: string, value: string) => {
    const a = getOrCreate(capId);
    a.pa = a.pa ?? { a: "", i: [] };
    const existing = a.pa.i.find((x) => x.id === itemId);
    if (existing) existing.v = value;
    else a.pa.i.push({ id: itemId, v: value });
  };

  const setPerfDesc = (capId: string, itemId: string, desc: string) => {
    const a = getOrCreate(capId);
    a.pa = a.pa ?? { a: "", i: [] };
    const existing = a.pa.i.find((x) => x.id === itemId);
    if (existing) existing.d = desc;
    else a.pa.i.push({ id: itemId, d: desc });
  };

  const setActionPriority = (capId: string, val: number) => {
    getOrCreate(capId).ap = val;
  };

  const addGap = (capId: string) => {
    const a = getOrCreate(capId);
    a.g = a.g ?? [];
    a.g.push({ a: "", i: [] });
  };

  const removeGap = (capId: string, gapIndex: number) => {
    const a = getOrCreate(capId);
    a.g = (a.g ?? []).filter((_, i) => i !== gapIndex);
  };

  const setGapTitle = (capId: string, gapIndex: number, title: string) => {
    const a = getOrCreate(capId);
    a.g = a.g ?? [];
    a.g[gapIndex] = a.g[gapIndex] ?? { a: "", i: [] };
    a.g[gapIndex].t = title;
  };

  const setGapDesc = (capId: string, gapIndex: number, desc: string) => {
    const a = getOrCreate(capId);
    a.g = a.g ?? [];
    a.g[gapIndex] = a.g[gapIndex] ?? { a: "", i: [] };
    a.g[gapIndex].d = desc;
  };

  const setGapItem = (
    capId: string,
    gapIndex: number,
    itemId: string,
    value: string,
    gapScaleIds: string[],
  ) => {
    const a = getOrCreate(capId);
    a.g = a.g ?? [];
    a.g[gapIndex] = a.g[gapIndex] ?? { a: "", i: [] };
    const gap = a.g[gapIndex];
    const existing = gap.i.find((x) => x.id === itemId);
    if (existing) {
      existing.v = value;
    } else {
      gap.i.push({ id: itemId, v: value });
    }

    // Same as the main app: overall gap assessment reflects the highest rated item.
    const maxIndex = gap.i.reduce((acc, cur) => {
      if (!cur.v) return acc;
      const idx = gapScaleIds.indexOf(cur.v);
      return Math.max(acc, idx);
    }, -1);
    gap.a = maxIndex >= 0 ? gapScaleIds[maxIndex] : "";
  };

  const setGapItemDesc = (
    capId: string,
    gapIndex: number,
    itemId: string,
    desc: string,
  ) => {
    const a = getOrCreate(capId);
    a.g = a.g ?? [];
    a.g[gapIndex] = a.g[gapIndex] ?? { a: "", i: [] };
    const gap = a.g[gapIndex];
    const existing = gap.i.find((x) => x.id === itemId);
    if (existing) {
      existing.d = desc;
    } else {
      gap.i.push({ id: itemId, d: desc });
    }
  };

  const getOrCreateSolutionAssessment = (
    solutionId: string,
  ): SolutionAssessmentAnswer => {
    if (!solutionAssessments.has(solutionId)) {
      solutionAssessments.set(solutionId, { i: solutionId });
    }
    return solutionAssessments.get(solutionId)!;
  };

  const setSolutionAssessmentValue = (
    solutionId: string,
    field: Exclude<keyof SolutionAssessmentAnswer, "i" | "n">,
    value: number,
  ) => {
    const assessment = getOrCreateSolutionAssessment(solutionId);
    assessment[field] = value as any;
  };

  const setSolutionAssessmentNote = (solutionId: string, note: string) => {
    const assessment = getOrCreateSolutionAssessment(solutionId);
    assessment.n = note;
  };

  return {
    view: ({ attrs }) => {
      const { collaboration = {}, catModel } = attrs.state;
      const { invitePayload, userInfo = {} } = collaboration;
      if (!invitePayload) return null;
      restoreDraft(attrs, invitePayload);

      const data = catModel?.data ?? {};
      const allCaps: ICapability[] = data.capabilities ?? [];
      const allSolutions: ISolution[] = data.solutions ?? [];
      const taskScale = data.taskScale ?? [];
      const performanceScale = data.performanceScale ?? [];
      const mainTasks = data.mainTasks ?? [];
      const performanceAspects = data.performanceAspects ?? [];
      const mainGaps = data.mainGaps ?? [];
      const gapScale = data.gapScale ?? [];

      const sendDone = () => {
        const capAnswers = capRefs
          .map((capRef) => answers.get(entityId(capRef)))
          .filter((a): a is CapabilityAnswer => {
            if (!a) return false;
            return !!(a.ta || a.pa || a.ap || (a.g && a.g.length > 0));
          });
        const solutionAnswers = solutionRefs
          .map((solutionRef) => solutionAssessments.get(entityId(solutionRef)))
          .filter((assessment): assessment is SolutionAssessmentAnswer => {
            if (!assessment) return false;
            return !!(
              assessment.trl != null ||
              assessment.integrationRl != null ||
              assessment.societalRl != null ||
              assessment.manufacturingRl != null ||
              assessment.commercialisationRl != null ||
              assessment.securityRl != null ||
              assessment.legalPrivacyEthicalRl != null ||
              assessment.imp != null ||
              (assessment.n && assessment.n.trim())
            );
          });
        const patch = buildPatchPayload(
          invitePayload,
          userInfo.name,
          userInfo.email,
          capAnswers,
          [],
          solutionAnswers,
        );
        const subject = t("collab_patch_subject");
        const body = t("collab_patch_body")
          .replace(/\{facilitatorName\}/g, invitePayload.fn)
          .replace(/\{userName\}/g, userInfo.name ?? "");
        const mailto = buildMailtoPatch(patch, invitePayload.fe, subject, body);
        window.location.href = mailto;
      };

      const saveCurrentDraft = () => {
        persistDraft(attrs, invitePayload);
      };

      const clearDraft = () => {
        const key = inviteDraftKey(invitePayload);
        const drafts = { ...(attrs.state.collaboration?.userDrafts ?? {}) };
        delete drafts[key];
        answers.clear();
        solutionAssessments.clear();
        pageIndex = 0;
        actions.updateCollaboration(attrs, {
          userDrafts: drafts,
          userInfo: {},
        });
      };

      const capRefs = invitePayload.c;
      const solutionRefs = invitePayload.sol ?? [];
      const totalPages = capRefs.length;
      if (pageIndex >= totalPages) pageIndex = Math.max(0, totalPages - 1);
      const currentRef = totalPages > 0 ? capRefs[pageIndex] : undefined;
      const currentCapId = currentRef ? entityId(currentRef) : undefined;
      const currentCap =
        currentRef && currentCapId
          ? capabilityFromInvite(currentRef, allCaps)
          : undefined;
      const currentLabel =
        currentRef && currentCapId
          ? currentCap
            ? t(currentCap.id as any) || currentCap.label
            : entityLabel(currentRef, currentCapId)
          : "";
      const answer = currentCapId ? getOrCreate(currentCapId) : undefined;
      const gapScaleIds = gapScale.map((s) => s.id);

      return m(".collab-user-view", [
        m(".card-panel", [
          m("h6", t("LANGUAGE")),
          m(".row", [
            m(".col.s12.m6", [
              m(LanguageSwitcher, {
                currentLanguage: i18n.currentLocale,
                onLanguageChange: (language: Languages) => {
                  void actions.setLanguage(attrs, language);
                },
              }),
            ]),
            m(".col.s12.m6", [m(ThemeToggle)]),
          ]),
          m(ConfirmButton, {
            iconName: "delete",
            confirmIconName: "check",
            title: t("clear"),
            onclick: clearDraft,
          }),
        ]),

        // Header
        m(".row", [
          m(
            ".col.s12",
            m(
              "p.teal-text",
              t("collab_invited_by")
                .replace(/\{name\}/g, invitePayload.fn)
                .replace(/\{email\}/g, invitePayload.fe),
            ),
          ),
        ]),

        // User info
        m(".row", [
          m(".col.s12.m5", [
            m("label", t("collab_your_name")),
            m("input[type=text]", {
              value: userInfo.name ?? "",
              oninput: (e: Event) => {
                actions.updateCollaboration(attrs, {
                  userInfo: {
                    ...userInfo,
                    name: (e.target as HTMLInputElement).value,
                  },
                });
                saveCurrentDraft();
              },
            }),
          ]),
          m(".col.s12.m5", [
            m("label", t("collab_your_email")),
            m("input[type=email]", {
              value: userInfo.email ?? "",
              oninput: (e: Event) => {
                actions.updateCollaboration(attrs, {
                  userInfo: {
                    ...userInfo,
                    email: (e.target as HTMLInputElement).value,
                  },
                });
                saveCurrentDraft();
              },
            }),
          ]),
        ]),

        // Capability Assessment (ca mode)
        invitePayload.m.includes("ca") &&
          m(".ca-section", [
            m("h5", t("collab_mode_ca")),
            totalPages > 0 &&
              m(".row", [
                m(".col.s12", [
                  m(
                    "div",
                    {
                      style:
                        "display:flex; align-items:center; justify-content:space-between; gap: 8px; margin-bottom: 8px;",
                    },
                    [
                      m(
                        "button.btn-flat",
                        {
                          disabled: pageIndex === 0,
                          onclick: () => {
                            pageIndex = Math.max(0, pageIndex - 1);
                            saveCurrentDraft();
                          },
                        },
                        [
                          m("i.material-icons.left", "chevron_left"),
                          t("prev_cap"),
                        ],
                      ),
                      m("strong", `${pageIndex + 1} / ${totalPages}`),
                      m(
                        "button.btn-flat",
                        {
                          disabled: pageIndex >= totalPages - 1,
                          onclick: () => {
                            pageIndex = Math.min(totalPages - 1, pageIndex + 1);
                            saveCurrentDraft();
                          },
                        },
                        [
                          t("next_cap"),
                          m("i.material-icons.right", "chevron_right"),
                        ],
                      ),
                    ],
                  ),
                ]),
              ]),
            currentCapId &&
              answer &&
              m(".card.hoverable", [
                m(".card-content", [
                  m("span.card-title", currentLabel),
                  currentCap?.desc && m("p.grey-text", currentCap.desc),

                  // Task importance per mainTask
                  mainTasks.length > 0 && [
                    m("h6", t("goal")),
                    ...mainTasks.map((task) => {
                      const currentVal =
                        answer.ta?.i.find((x) => x.id === task.id)?.v ?? "";
                      const currentDesc =
                        answer.ta?.i.find((x) => x.id === task.id)?.d ?? "";
                      return m(".row.valign-wrapper", [
                        m(".col.s12.m5", [
                          m("label", t(task.id as any) || task.label),
                          task.desc &&
                            m(
                              "small.grey-text.block.collab-field-desc",
                              t(`${task.id}_desc` as any) || task.desc,
                            ),
                        ]),
                        m(".col.s12.m7", [
                          m(
                            "select.browser-default",
                            {
                              value: currentVal,
                              onchange: (e: Event) =>
                                (() => {
                                  setTaskItem(
                                    currentCapId,
                                    task.id,
                                    (e.target as HTMLSelectElement).value,
                                  );
                                  saveCurrentDraft();
                                })(),
                            },
                            [
                              m("option[value='']", "—"),
                              ...taskScale.map((s) =>
                                m(
                                  "option",
                                  {
                                    value: s.id,
                                    selected: currentVal === s.id,
                                  },
                                  t(s.id as any) || s.label,
                                ),
                              ),
                            ],
                          ),
                          m("label", t("expl")),
                          m("textarea.materialize-textarea", {
                            value: currentDesc,
                            oninput: (e: Event) =>
                              (() => {
                                setTaskDesc(
                                  currentCapId,
                                  task.id,
                                  (e.target as HTMLTextAreaElement).value,
                                );
                                saveCurrentDraft();
                              })(),
                          }),
                        ]),
                      ]);
                    }),
                  ],

                  // Performance per performanceAspect
                  performanceAspects.length > 0 && [
                    m("h6", t("perf")),
                    ...performanceAspects.map((aspect) => {
                      const currentVal =
                        answer.pa?.i.find((x) => x.id === aspect.id)?.v ?? "";
                      const currentDesc =
                        answer.pa?.i.find((x) => x.id === aspect.id)?.d ?? "";
                      return m(".row.valign-wrapper", [
                        m(".col.s12.m5", [
                          m("label", t(aspect.id as any) || aspect.label),
                          aspect.desc &&
                            m(
                              "small.grey-text.block.collab-field-desc",
                              t(`${aspect.id}_desc` as any) || aspect.desc,
                            ),
                        ]),
                        m(".col.s12.m7", [
                          m(
                            "select.browser-default",
                            {
                              value: currentVal,
                              onchange: (e: Event) =>
                                (() => {
                                  setPerfItem(
                                    currentCapId,
                                    aspect.id,
                                    (e.target as HTMLSelectElement).value,
                                  );
                                  saveCurrentDraft();
                                })(),
                            },
                            [
                              m("option[value='']", "—"),
                              ...performanceScale.map((s) =>
                                m(
                                  "option",
                                  {
                                    value: s.id,
                                    selected: currentVal === s.id,
                                  },
                                  t(s.id as any) || s.label,
                                ),
                              ),
                            ],
                          ),
                          m("label", t("expl")),
                          m("textarea.materialize-textarea", {
                            value: currentDesc,
                            oninput: (e: Event) =>
                              (() => {
                                setPerfDesc(
                                  currentCapId,
                                  aspect.id,
                                  (e.target as HTMLTextAreaElement).value,
                                );
                                saveCurrentDraft();
                              })(),
                          }),
                        ]),
                      ]);
                    }),
                  ],

                  // Gaps
                  m("h6", t("gaps")),
                  ...(answer.g?.map((gap, gapIndex) =>
                    m(".card-panel", [
                      m(".row", [
                        m(".col.s12.m5", [
                          m("label", t("title")),
                          m("input[type=text]", {
                            value: gap.t ?? "",
                            oninput: (e: Event) =>
                              (() => {
                                setGapTitle(
                                  currentCapId,
                                  gapIndex,
                                  (e.target as HTMLInputElement).value,
                                );
                                saveCurrentDraft();
                              })(),
                          }),
                        ]),
                        m(".col.s12.m6", [
                          m("label", t("desc")),
                          m("textarea.materialize-textarea", {
                            value: gap.d ?? "",
                            oninput: (e: Event) =>
                              (() => {
                                setGapDesc(
                                  currentCapId,
                                  gapIndex,
                                  (e.target as HTMLTextAreaElement).value,
                                );
                                saveCurrentDraft();
                              })(),
                          }),
                        ]),
                        m(
                          ".col.s12.m1",
                          { style: "padding-top: 28px;" },
                          m(
                            "button.btn-flat.red-text",
                            {
                              onclick: () => {
                                removeGap(currentCapId, gapIndex);
                                saveCurrentDraft();
                              },
                            },
                            m("i.material-icons", "delete"),
                          ),
                        ),
                      ]),
                      ...mainGaps.map((gapItem) => {
                        const currentVal =
                          gap.i.find((x) => x.id === gapItem.id)?.v ?? "";
                        const currentDesc =
                          gap.i.find((x) => x.id === gapItem.id)?.d ?? "";
                        return m(".row.valign-wrapper", [
                          m(".col.s12.m5", [
                            m("label", t(gapItem.id as any) || gapItem.label),
                            gapItem.desc &&
                              m(
                                "small.grey-text.block.collab-field-desc",
                                t(`${gapItem.id}_desc` as any) || gapItem.desc,
                              ),
                          ]),
                          m(".col.s12.m7", [
                            m(
                              "select.browser-default",
                              {
                                value: currentVal,
                                onchange: (e: Event) =>
                                  (() => {
                                    setGapItem(
                                      currentCapId,
                                      gapIndex,
                                      gapItem.id,
                                      (e.target as HTMLSelectElement).value,
                                      gapScaleIds,
                                    );
                                    saveCurrentDraft();
                                  })(),
                              },
                              [
                                m("option[value='']", "—"),
                                ...gapScale.map((s) =>
                                  m(
                                    "option",
                                    {
                                      value: s.id,
                                      selected: currentVal === s.id,
                                    },
                                    t(s.id as any) || s.label,
                                  ),
                                ),
                              ],
                            ),
                            m("label", t("expl")),
                            m("textarea.materialize-textarea", {
                              value: currentDesc,
                              oninput: (e: Event) =>
                                (() => {
                                  setGapItemDesc(
                                    currentCapId,
                                    gapIndex,
                                    gapItem.id,
                                    (e.target as HTMLTextAreaElement).value,
                                  );
                                  saveCurrentDraft();
                                })(),
                            }),
                          ]),
                        ]);
                      }),
                    ]),
                  ) ?? []),
                  m(
                    "button.btn-flat",
                    {
                      onclick: () => {
                        addGap(currentCapId);
                        saveCurrentDraft();
                      },
                    },
                    [m("i.material-icons.left", "add"), t("add_gap")],
                  ),

                  // Action priority
                  m(".row", [
                    m(".col.s12", [
                      m("label", t("action_priority")),
                      m(
                        "p.range-field",
                        m("input[type=range][min=1][max=5][step=1]", {
                          value: answer.ap ?? 3,
                          oninput: (e: Event) =>
                            (() => {
                              setActionPriority(
                                currentCapId,
                                parseInt(
                                  (e.target as HTMLInputElement).value,
                                  10,
                                ),
                              );
                              saveCurrentDraft();
                            })(),
                        }),
                      ),
                      m(
                        ".flex-row",
                        {
                          style: "display:flex; justify-content:space-between",
                        },
                        [
                          m("small", t("action_priority_label_1")),
                          m("small", t("action_priority_label_3")),
                          m("small", t("action_priority_label_5")),
                        ],
                      ),
                    ]),
                  ]),
                ]),
              ]),
          ]),

        // Solution Assessment (sa mode)
        invitePayload.m.includes("sa") &&
          m(".sa-section", [
            m("h5", t("collab_mode_sa")),
            solutionRefs.length === 0
              ? m("p.grey-text", t("solution_empty"))
              : solutionRefs.map((solutionRef) => {
                  const solutionId = entityId(solutionRef);
                  const solution = allSolutions.find(
                    (s) => s.id === solutionId,
                  );
                  const solutionLabel = solution
                    ? solution.label
                    : entityLabel(solutionRef, solutionId);
                  const response = getOrCreateSolutionAssessment(solutionId);

                  return m(".card.hoverable", [
                    m(".card-content", [
                      m("span.card-title", solutionLabel),
                      ...(solution?.desc
                        ? [m("p.grey-text", solution.desc)]
                        : []),
                      ...allSolutionReadinessConfigs.map((config) => {
                        const currentValue =
                          (response as any)[config.id] ??
                          (solution as any)?.[config.id] ??
                          config.min;
                        const descIndex = currentValue - config.min;
                        const description = translatedOrFallback(
                          `${config.descriptionKeyPrefix}${currentValue}`,
                          config.descriptions[descIndex] ?? "",
                        );

                        return m(".row", [
                          m(".col.s12", [
                            m(
                              "label",
                              translatedOrFallback(
                                config.labelKey,
                                config.fallbackLabel,
                              ),
                            ),
                            m(
                              "p.range-field",
                              m("input[type=range]", {
                                min: config.min,
                                max: config.max,
                                step: 1,
                                value: currentValue,
                                oninput: (e: Event) => {
                                  setSolutionAssessmentValue(
                                    solutionId,
                                    config.id as any,
                                    parseInt(
                                      (e.target as HTMLInputElement).value,
                                      10,
                                    ),
                                  );
                                  saveCurrentDraft();
                                },
                              }),
                            ),
                            m("small", `${config.prefix} ${currentValue}`),
                            m(
                              "small.grey-text.block.collab-field-desc",
                              description,
                            ),
                          ]),
                        ]);
                      }),
                      m(".row", [
                        m(".col.s12", [
                          m("label", t("sol_expected_impact_title")),
                          m(
                            "p.range-field",
                            m("input[type=range][min=1][max=5][step=1]", {
                              value: response.imp ?? 3,
                              oninput: (e: Event) => {
                                setSolutionAssessmentValue(
                                  solutionId,
                                  "imp",
                                  parseInt(
                                    (e.target as HTMLInputElement).value,
                                    10,
                                  ),
                                );
                                saveCurrentDraft();
                              },
                            }),
                          ),
                          m("small", `${response.imp ?? 3}`),
                        ]),
                      ]),
                      m(".row", [
                        m(".col.s12", [
                          m("label", t("desc")),
                          m("textarea.materialize-textarea", {
                            value: response.n ?? "",
                            oninput: (e: Event) => {
                              setSolutionAssessmentNote(
                                solutionId,
                                (e.target as HTMLTextAreaElement).value,
                              );
                              saveCurrentDraft();
                            },
                          }),
                        ]),
                      ]),
                    ]),
                  ]);
                }),
          ]),

        // Done button
        m(".row", [
          m(
            ".col.s12",
            m(
              "button.btn.btn-large.waves-effect.waves-light.teal",
              { onclick: sendDone },
              [m("i.material-icons.left", "send"), t("collab_done")],
            ),
          ),
        ]),
      ]);
    },
  };
};

// ─── Main Collaboration Page ──────────────────────────────────────────────────

export const CollaborationPage: MeiosisComponent = () => {
  return {
    oninit: ({ attrs }) => {
      actions.setPage(attrs, Pages.COLLABORATE);

      // Decode invite payload from URL ?i= param
      const iParam = m.route.param("i");
      const pParam = m.route.param("p");
      if (iParam) {
        try {
          const invite = decodePayload<InvitePayload>(iParam);
          actions.updateCollaboration(attrs, { invitePayload: invite });
        } catch {
          console.warn("Failed to decode invite payload from URL");
          actions.updateCollaboration(attrs, { invitePayload: undefined });
        }
      } else if (pParam) {
        // Ensure facilitator patch links do not inherit a stale user-invite view.
        actions.updateCollaboration(attrs, { invitePayload: undefined });
      }
    },
    view: ({ attrs }) => {
      const { collaboration = {} } = attrs.state;
      const isUserView = !!collaboration.invitePayload;

      return m(".collaboration-page.container", [
        m("h4", [m("i.material-icons.left", "group"), t("collab_page_title")]),
        isUserView
          ? m(UserAssessmentView, { ...attrs })
          : m(".row", [
              m(".col.s12.l6", m(FacilitatorSendInvite, { ...attrs })),
              m(".col.s12.l6", m(PatchLoader, { ...attrs })),
            ]),
      ]);
    },
  };
};
