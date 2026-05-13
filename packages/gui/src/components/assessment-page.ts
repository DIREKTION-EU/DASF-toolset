import { getFormI18nConfig } from "../services/translations";
import m from "mithril";
import {
  FlatButton,
  LikertScale,
  RoundIconButton,
  TooltipComponent,
} from "mithril-materialized";
import { FormAttributes, LayoutForm, SlimdownView } from "mithril-ui-form";
import { Pages, ICapability, CapabilityModel } from "../models";
import { MeiosisComponent, t, i18n, actions } from "../services";
import { PageNav } from "./ui";
import type {
  CollaborationPatch,
  CapabilityAssessmentResponseItem,
} from "../services/collaboration-service";
import type { ILabelled } from "../models/capability-model/capability-model";
import {
  formatDate,
  getTextColorFromBackground,
  getOptionsLabel,
  localizeCapabilityModelData,
  toWord,
  translatedOrFallback,
} from "../utils";

type AssessmentGroup = "task" | "performance" | "gap";

type ParticipantComment = {
  author: string;
  initials: string;
  text: string;
};

type ConsensusSummary = {
  modeId?: string;
  totalVotes: number;
  counts: Record<string, number>;
  comments: ParticipantComment[];
};

type GapDraft = {
  title?: string;
  desc?: string;
  assessmentId?: string;
  items: CapabilityAssessmentResponseItem[];
  author: string;
  initials: string;
};

type ConsensusGhostContext = {
  __consensusGhost: {
    capability: ICapability;
    patches: CollaborationPatch[];
    viewMode: boolean;
  };
};

const fallbackText = (key: string, fallback: string) =>
  translatedOrFallback(t(key as any), key, fallback);

const fallbackTextWithVars = (
  key: string,
  fallback: string,
  vars: Record<string, string>,
) => {
  const translated = t(key as any, vars as any);
  const value = Array.isArray(translated)
    ? translated.join("")
    : translated == null
      ? ""
      : `${translated}`;
  return value && value !== key && value !== `@@${key}@@` ? value : fallback;
};

const labelFor = (item?: { id?: string; label?: string }, fallback = "") =>
  item?.id
    ? translatedOrFallback(t(item.id as any), item.id, item.label || fallback)
    : item?.label || fallback;

const valueLabel = (options: ILabelled[] = [], id?: string, fallback = "—") => {
  if (!id) return fallback;
  const option = options.find((item) => item.id === id);
  return option ? labelFor(option, option.label) : fallback;
};

const valueColor = (options: ILabelled[] = [], id?: string) =>
  options.find((item) => item.id === id)?.color;

const contributorName = (patch: CollaborationPatch, index: number) =>
  patch.un?.trim() ||
  patch.ue?.trim() ||
  `${fallbackText("collab_participant", "Participant")} ${index + 1}`;

const contributorInitials = (label: string) => {
  const clean = label
    .replace(/@.*$/, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
  return clean || "?";
};

const getCapabilityPatches = (
  patches: CollaborationPatch[] = [],
  capabilityId?: string,
) =>
  capabilityId
    ? patches.filter((patch) =>
        (patch.ca ?? []).some((answer) => answer.c === capabilityId),
      )
    : [];

const getConsensusSummary = (
  patches: CollaborationPatch[],
  capabilityId: string,
  group: AssessmentGroup,
  itemId: string,
  gapIndex?: number,
): ConsensusSummary => {
  const counts: Record<string, number> = {};
  const comments: ParticipantComment[] = [];

  patches.forEach((patch, index) => {
    const answer = (patch.ca ?? []).find((entry) => entry.c === capabilityId);
    if (!answer) return;

    const sourceItems =
      group === "task"
        ? answer.ta?.i
        : group === "performance"
          ? answer.pa?.i
          : answer.g?.[gapIndex ?? -1]?.i;
    const item = sourceItems?.find((entry) => entry.id === itemId);
    if (!item) return;

    if (item.v) {
      counts[item.v] = (counts[item.v] ?? 0) + 1;
    }
    if (item.d?.trim()) {
      const author = contributorName(patch, index);
      comments.push({
        author,
        initials: contributorInitials(author),
        text: item.d.trim(),
      });
    }
  });

  const modeId = Object.entries(counts)
    .sort((left, right) => right[1] - left[1])
    .shift()?.[0];

  return {
    modeId,
    totalVotes: Object.values(counts).reduce((sum, value) => sum + value, 0),
    counts,
    comments,
  };
};

const getGapDrafts = (
  patches: CollaborationPatch[],
  capabilityId: string,
): GapDraft[] => {
  const drafts: GapDraft[] = [];
  patches.forEach((patch, index) => {
    const answer = (patch.ca ?? []).find((entry) => entry.c === capabilityId);
    if (!answer?.g?.length) return;
    const author = contributorName(patch, index);
    const initials = contributorInitials(author);
    answer.g.forEach((gap) => {
      const hasContent =
        !!gap.t?.trim() ||
        !!gap.d?.trim() ||
        (gap.i ?? []).some((item) => item.v || item.d?.trim());
      if (!hasContent) return;
      drafts.push({
        title: gap.t,
        desc: gap.d,
        assessmentId: gap.a,
        items: gap.i.map((item) => ({ ...item })),
        author,
        initials,
      });
    });
  });
  return drafts;
};

const renderHistogram = (
  options: ILabelled[] = [],
  consensus: ConsensusSummary,
  muted = false,
) => {
  if (!options.length || consensus.totalVotes === 0) return null;
  const maxCount = Math.max(
    1,
    ...options.map((option) => consensus.counts[option.id] ?? 0),
  );

  return m(
    `.dasf-micro-histogram${muted ? ".dasf-micro-histogram--muted" : ""}`,
    options.map((option) => {
      const count = consensus.counts[option.id] ?? 0;
      const label = labelFor(option, option.label);
      return m(
        ".dasf-micro-histogram__bar-wrap",
        {
          title: `${label}: ${count}`,
        },
        [
          m("span.dasf-micro-histogram__count", count),
          m("span.dasf-micro-histogram__rail", [
            m("span.dasf-micro-histogram__bar", {
              class: option.id === consensus.modeId ? "is-mode" : "",
              style: `height: ${count ? Math.max(16, (count / maxCount) * 42) : 6}px`,
            }),
          ]),
          m("span.dasf-micro-histogram__label", label),
        ],
      );
    }),
  );
};

const renderStatusPill = (
  options: ILabelled[] = [],
  id?: string,
  emptyLabel = "—",
) => {
  const label = valueLabel(options, id, emptyLabel);
  const color = valueColor(options, id);
  return m(
    ".dasf-status-pill",
    {
      style: color
        ? `background:${color}; color:${getTextColorFromBackground(color) === "white-text" ? "#fff" : "#111"}`
        : undefined,
    },
    label,
  );
};

const renderCommentBubbles = (comments: ParticipantComment[] = []) => {
  if (!comments.length) return null;
  return m(
    ".dasf-comment-bubbles",
    comments.map((comment) =>
      m(".dasf-comment-bubble", [
        m("span.dasf-comment-bubble__initials", comment.initials),
        m("span.dasf-comment-bubble__text", comment.text),
      ]),
    ),
  );
};

const justificationKey = (
  group: AssessmentGroup,
  itemId: string,
  gapIndex?: number,
) =>
  group === "gap" ? `gap:${gapIndex ?? 0}:${itemId}` : `${group}:${itemId}`;

const renderParticipantGapCards = (
  drafts: GapDraft[],
  gapOptions: ILabelled[],
  promote?: (draft: GapDraft) => void,
) => {
  if (!drafts.length) return null;
  return m(".dasf-gap-drafts", [
    m(
      "h5",
      fallbackText(
        "participant_gap_suggestions",
        "Participant gap suggestions",
      ),
    ),
    m(
      ".dasf-gap-drafts__grid",
      drafts.map((draft) =>
        m(".dasf-gap-card", [
          m("div.dasf-gap-card__meta", [
            m("span.dasf-gap-card__initials", draft.initials),
            m("span", draft.author),
          ]),
          m("h6", draft.title || fallbackText("gap", "Gap")),
          draft.desc && m("p", draft.desc),
          draft.assessmentId &&
            m("p.dasf-gap-card__assessment", [
              fallbackText(
                "participant_consensus_mode",
                "Participant consensus",
              ),
              ": ",
              valueLabel(gapOptions, draft.assessmentId),
            ]),
          draft.items.some((item) => item.v || item.d?.trim()) &&
            m(
              ".dasf-gap-card__items",
              draft.items
                .filter((item) => item.v || item.d?.trim())
                .map((item) =>
                  m("div", [
                    m("strong", item.id),
                    item.v ? `: ${valueLabel(gapOptions, item.v)}` : "",
                    item.d?.trim()
                      ? m("div.small.grey-text", item.d.trim())
                      : null,
                  ]),
                ),
            ),
          promote &&
            m(FlatButton, {
              label: fallbackText("promote_to_final", "Promote to final"),
              iconName: "north_east",
              onclick: () => promote(draft),
            }),
        ]),
      ),
    ),
  ]);
};

const renderSummaryTable = (
  cap: ICapability,
  patches: CollaborationPatch[],
  taskItems: ILabelled[],
  performanceItems: ILabelled[],
  mainGaps: ILabelled[],
  taskScale: ILabelled[],
  performanceScale: ILabelled[],
  gapScale: ILabelled[],
) => {
  const rows = [
    ...taskItems.map((item) => {
      const consensus = getConsensusSummary(patches, cap.id, "task", item.id);
      const finalValue = cap.taskAssessment?.items?.find(
        (entry) => entry.id === item.id,
      )?.value;
      return {
        name: `${fallbackText("goal", "Goal")}: ${labelFor(item, item.label)}`,
        consensus: valueLabel(taskScale, consensus.modeId),
        final: valueLabel(taskScale, finalValue),
      };
    }),
    ...performanceItems.map((item) => {
      const consensus = getConsensusSummary(
        patches,
        cap.id,
        "performance",
        item.id,
      );
      const finalValue = cap.performanceAssessment?.items?.find(
        (entry) => entry.id === item.id,
      )?.value;
      return {
        name: `${fallbackText("perf_asp", "Performance aspect")}: ${labelFor(item, item.label)}`,
        consensus: valueLabel(performanceScale, consensus.modeId),
        final: valueLabel(performanceScale, finalValue),
      };
    }),
    ...(cap.gaps ?? []).flatMap((gap, gapIndex) =>
      mainGaps.map((item) => {
        const consensus = getConsensusSummary(
          patches,
          cap.id,
          "gap",
          item.id,
          gapIndex,
        );
        const finalValue = gap.gapAssessment?.items?.find(
          (entry) => entry.id === item.id,
        )?.value;
        return {
          name: `${fallbackText("gap", "Gap")} ${gapIndex + 1}: ${labelFor(item, item.label)}`,
          consensus: valueLabel(gapScale, consensus.modeId),
          final: valueLabel(gapScale, finalValue),
        };
      }),
    ),
  ].filter((row) => row.consensus !== "—" || row.final !== "—");

  if (!rows.length) return null;

  return m(".dasf-executive-summary", [
    m("h4", fallbackText("executive_summary", "Executive summary")),
    m("table.striped", [
      m(
        "thead",
        m("tr", [
          m("th", fallbackText("goal_or_aspect", "Goal/Aspect name")),
          m(
            "th",
            fallbackText(
              "participant_consensus_mode",
              "Participant consensus mode",
            ),
          ),
          m(
            "th",
            fallbackText("facilitator_final_value", "Facilitator final value"),
          ),
        ]),
      ),
      m(
        "tbody",
        rows.map((row) =>
          m("tr", [
            m("td", row.name),
            m("td", row.consensus),
            m("td", row.final),
          ]),
        ),
      ),
    ]),
  ]);
};

const renderViewModeSection = (
  cap: ICapability,
  patches: CollaborationPatch[],
  title: string,
  items: ILabelled[],
  scale: ILabelled[],
  group: AssessmentGroup,
  assessment?: { items?: Array<{ id: string; value?: string; desc?: string }> },
  gapIndex?: number,
) => {
  if (!items.length) return null;
  return m(".dasf-report-section", [
    m("h4", title),
    ...items.map((item) => {
      const finalItem = assessment?.items?.find(
        (entry) => entry.id === item.id,
      );
      const consensus = getConsensusSummary(
        patches,
        cap.id,
        group,
        item.id,
        gapIndex,
      );
      const justification =
        cap.consensusJustifications?.[
          justificationKey(group, item.id, gapIndex)
        ];
      return m(".dasf-report-item", [
        m("div.dasf-report-item__header", [
          m("h5", labelFor(item, item.label)),
          renderStatusPill(scale, finalItem?.value),
        ]),
        item.desc &&
          m(
            "p.dasf-report-item__desc",
            translatedOrFallback(
              t(`${item.id}_desc` as any),
              `${item.id}_desc`,
              item.desc,
            ),
          ),
        renderHistogram(scale, consensus, true),
        m("p.dasf-report-item__consensus", [
          fallbackText("participant_consensus_mode", "Participant consensus"),
          ": ",
          valueLabel(scale, consensus.modeId),
        ]),
        finalItem?.desc && m("p", finalItem.desc),
        renderCommentBubbles(consensus.comments),
        justification &&
          m("p.dasf-report-item__justification", [
            fallbackText(
              "facilitator_justification",
              "Facilitator justification",
            ),
            ": ",
            justification,
          ]),
        m("hr"),
      ]);
    }),
  ]);
};

export const AssessmentPage: MeiosisComponent = () => {
  let viewMode = false;

  return {
    oninit: ({ attrs }) => {
      const id = m.route.param("id") || attrs.state.capabilityId;
      const capabilities = attrs.state.catModel?.data?.capabilities ?? [];
      if (id && attrs.state.catModel) {
        const capability =
          capabilities.filter((cap) => cap.id === id).shift() ||
          ({} as ICapability);
        const { id: capabilityId, categoryId, subcategoryId } = capability;
        actions.update(attrs, {
          page: Pages.ASSESSMENT,
          capabilityId,
          categoryId,
          subcategoryId,
        });
      } else if (capabilities.length > 0) {
        const { id: capabilityId, categoryId, subcategoryId } = capabilities[0];
        actions.update(attrs, {
          page: Pages.ASSESSMENT,
          capabilityId,
          categoryId,
          subcategoryId,
        });
      } else {
        actions.setPage(attrs, Pages.ASSESSMENT);
      }
    },
    view: ({ attrs }) => {
      const {
        catModel = { data: {} } as CapabilityModel,
        assessment: af = [],
      } = attrs.state;
      const assessmentForm = af.filter((a) => a);
      const { data = {}, version = 0 } = catModel;
      const {
        assessmentScale = [],
        hazardTypes = [],
        selectedHazardIds = [],
        taskScale = [],
        performanceScale = [],
        mainGaps = [],
        gapScale = [],
        stakeholders = [],
        title = "cat",
      } = data;
      const capabilities = data.capabilities ?? [];
      const capabilityId =
        m.route.param("id")?.replace(":id", "") ||
        attrs.state.capabilityId ||
        "";
      const cap = (capabilities
        .filter((cap) => cap.id === capabilityId)
        .shift() ||
        (capabilities.length > 0 && capabilities[0]) ||
        {}) as ICapability;

      if (!capabilityId && cap.id) {
        m.route.set(t("assessment_route"), { id: cap.id });
      }

      const capIndex = capabilities.findIndex((c) => c.id === cap.id);
      const prevCap = capIndex > 0 ? capabilities[capIndex - 1] : null;
      const nextCap =
        capIndex < capabilities.length - 1 ? capabilities[capIndex + 1] : null;

      if (capabilities.length === 0) {
        return m(
          ".assessment.page",
          m(
            ".row",
            m(".col.s12.center.grey-text", { style: "padding: 40px;" }, [
              m("p", t("assess_content")),
              m(
                "a",
                {
                  href: "#",
                  onclick: (e: Event) => {
                    e.preventDefault();
                    actions.changePage(attrs, Pages.OVERVIEW);
                  },
                },
                t("overview"),
              ),
            ]),
          ),
        );
      }

      const { assessmentId } = cap;
      const assessment = assessmentScale
        .filter((a) => a.id === assessmentId)
        .shift();
      const color = assessment ? assessment.color : undefined;
      const capPatches = getCapabilityPatches(
        attrs.state.collaboration?.patches,
        cap.id,
      );
      const selectedHazards = hazardTypes.filter((h) =>
        selectedHazardIds.includes(h.id),
      );
      const relevantHazards = selectedHazards.filter((h) =>
        (cap.hazardIds || []).includes(h.id),
      );
      const gapDrafts = cap.id ? getGapDrafts(capPatches, cap.id) : [];
      const capabilityLabel = translatedOrFallback(
        t(cap.id as any),
        cap.id,
        cap.label || fallbackText("cap", "Capability"),
      );
      const localizedData = localizeCapabilityModelData(data);
      const mainTasksForCapability: ILabelled[] = [
        {
          id: "capability-importance",
          label: fallbackTextWithVars(
            "assess_capability_importance_for_capability",
            `Assess the importance of \"${capabilityLabel}\" for the chosen scope.`,
            { capability: capabilityLabel },
          ),
        },
      ];
      const performanceAspectsForCapability = (
        localizedData.performanceAspects ?? []
      ).map((aspect) => {
        if (aspect.id === "PA-1") {
          return {
            ...aspect,
            desc: fallbackTextWithVars(
              "perf_effectiveness_tooltip",
              `How effective is ${capabilityLabel}?`,
              { capability: capabilityLabel },
            ),
          };
        }
        if (aspect.id === "PA-2") {
          return {
            ...aspect,
            desc: fallbackTextWithVars(
              "perf_safety_professionals_tooltip",
              `What is the level of the physical and mental safety of operational personnel working on ${capabilityLabel}?`,
              { capability: capabilityLabel },
            ),
          };
        }
        if (aspect.id === "PA-3") {
          return {
            ...aspect,
            desc: fallbackTextWithVars(
              "perf_efficiency_tooltip",
              `How efficient is ${capabilityLabel}?`,
              { capability: capabilityLabel },
            ),
          };
        }
        return aspect;
      });
      const ghostContext: ConsensusGhostContext = {
        __consensusGhost: {
          capability: cap,
          patches: capPatches,
          viewMode,
        },
      };

      const promoteGapDraft = (draft: GapDraft) => {
        cap.gaps = [
          ...(cap.gaps ?? []),
          {
            title: draft.title,
            desc: draft.desc,
            gapAssessment: {
              assessmentId: draft.assessmentId || "",
              items: draft.items.map((item) => ({
                id: item.id,
                label: item.id,
                value: item.v,
                desc: item.d,
              })),
            },
          },
        ];
        actions.saveModel(attrs, catModel);
      };

      return m(
        ".assessment.page",
        [
          m(PageNav, { ...attrs }),
          m(
            "button.dasf-context-drawer-toggle",
            {
              onclick: () =>
                actions.openDrawer(attrs, "capability", capabilityId),
              style:
                "position:fixed; top:16px; right:16px; width:48px; height:48px; border-radius:50%; border:none; background:#1976d2; color:white; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 4px rgba(0,0,0,0.2); font-size:24px;",
              title: t("drawer_capabilities"),
            },
            m("i.material-icons", "info"),
          ),
          cap &&
            m(".row", [
              m(".right.dasf-assessment-toolbar", [
                m(FlatButton, {
                  title: "Save to Word",
                  iconName: "download",
                  onclick: () => {
                    const filename = `${formatDate(Date.now())}_${
                      cap.label || title
                    }_v${version}.docx`;
                    toWord(filename, data, cap);
                  },
                }),
                m(RoundIconButton, {
                  className: "dasf-assessment-mode-toggle-btn",
                  iconName: viewMode ? "edit" : "visibility",
                  tooltip: viewMode ? t("edit") : t("view"),
                  title: viewMode ? t("edit") : t("view"),
                  tooltipPosition: "left",
                  onclick: () => {
                    viewMode = !viewMode;
                  },
                }),
                color &&
                  m("div.square", {
                    style: `background-color: ${color}; border: 4px solid var(--mm-text-primary, #111); width: 40px; height: 40px; border-radius: 20px`,
                  }),
              ]),
              m("h5.col.s12.condensed", [
                `${t("cap")} '${translatedOrFallback(t(cap.id as any), cap.id, cap.label)}'`,
                cap.desc &&
                  m(
                    TooltipComponent,
                    {
                      position: "bottom",
                      html: cap.desc,
                      margin: 12,
                      inDuration: 100,
                      outDuration: 100,
                    },
                    m("i.material-icons.info-icon", "info"),
                  ),
              ]),
              m(
                ".col.s12",
                m(SlimdownView, { md: t("ass_instr"), removeParagraphs: true }),
              ),
            ]),
        ],
        cap && [
          !viewMode &&
            renderParticipantGapCards(gapDrafts, gapScale, promoteGapDraft),
          viewMode
            ? m(".dasf-assessment-view-mode", [
                m(".dasf-report-section", [
                  m("h4", t("drawer_relevant_hazards")),
                  relevantHazards.length > 0
                    ? m(
                        ".dasf-report-tags",
                        relevantHazards.map((hazard) =>
                          m(
                            "span.dasf-report-tag",
                            translatedOrFallback(
                              t(hazard.id as any),
                              hazard.id,
                              hazard.label,
                            ),
                          ),
                        ),
                      )
                    : m("p.grey-text", fallbackText("none", "None")),
                  m("hr"),
                ]),
                renderSummaryTable(
                  cap,
                  capPatches,
                  mainTasksForCapability,
                  performanceAspectsForCapability,
                  mainGaps,
                  taskScale,
                  performanceScale,
                  gapScale,
                ),
                cap.desc &&
                  m(".dasf-report-section", [
                    m("h4", fallbackText("desc", "Description")),
                    m("p", cap.desc),
                    m("hr"),
                  ]),
                Array.isArray(cap.capabilityStakeholders) &&
                  cap.capabilityStakeholders.length > 0 &&
                  m(".dasf-report-section", [
                    m("h4", fallbackText("shs", "Stakeholders")),
                    m(
                      ".dasf-report-tags",
                      cap.capabilityStakeholders.map((stakeholderId) =>
                        m(
                          "span.dasf-report-tag",
                          getOptionsLabel(stakeholders, stakeholderId, false) ||
                            stakeholderId,
                        ),
                      ),
                    ),
                    cap.otherStakeholder && m("p", cap.otherStakeholder),
                    m("hr"),
                  ]),
                renderViewModeSection(
                  cap,
                  capPatches,
                  fallbackText("main_goals", "Goals"),
                  mainTasksForCapability,
                  taskScale,
                  "task",
                  cap.taskAssessment,
                ),
                renderViewModeSection(
                  cap,
                  capPatches,
                  fallbackText("perf_asps", "Performance aspects"),
                  performanceAspectsForCapability,
                  performanceScale,
                  "performance",
                  cap.performanceAssessment,
                ),
                gapDrafts.length > 0 &&
                  renderParticipantGapCards(gapDrafts, gapScale),
                ...(cap.gaps ?? []).map((gap, gapIndex) =>
                  m(".dasf-report-section", [
                    m(
                      "h4",
                      `${fallbackText("gap", "Gap")} ${gapIndex + 1}: ${gap.title || fallbackText("untitled_gap", "Untitled gap")}`,
                    ),
                    gap.desc && m("p", gap.desc),
                    renderViewModeSection(
                      cap,
                      capPatches,
                      fallbackText("prob_areas", "Problem areas"),
                      mainGaps,
                      gapScale,
                      "gap",
                      gap.gapAssessment,
                      gapIndex,
                    ),
                  ]),
                ),
              ])
            : m(".row", [
                selectedHazards.length > 0 &&
                  m(".col.s12", { style: "margin-bottom: 8px;" }, [
                    m("label.dasf-field-label", t("drawer_relevant_hazards")),
                    m(
                      ".dasf-hazard-chips",
                      selectedHazards.map((h) => {
                        const selected = (cap.hazardIds || []).includes(h.id);
                        return m(
                          "span.dasf-hazard-chip",
                          {
                            key: h.id,
                            class: selected ? "active" : "",
                            onclick: () => {
                              cap.hazardIds = selected
                                ? (cap.hazardIds || []).filter(
                                    (id) => id !== h.id,
                                  )
                                : [...(cap.hazardIds || []), h.id];
                              actions.saveModel(attrs, catModel);
                            },
                          },
                          translatedOrFallback(t(h.id as any), h.id, h.label),
                        );
                      }),
                    ),
                  ]),
                m(
                  "form.col.s12",
                  { lang: i18n.currentLocale, spellcheck: false },
                  m(LayoutForm, {
                    form: assessmentForm,
                    obj: cap,
                    context: [
                      {
                        ...localizedData,
                        mainTasks: mainTasksForCapability,
                        performanceAspects: performanceAspectsForCapability,
                      },
                      ghostContext,
                    ],
                    i18n: getFormI18nConfig(),
                    onchange: () => {
                      actions.saveModel(attrs, catModel);
                    },
                  } as FormAttributes<Partial<ICapability>>),
                ),
              ]),
          m(
            ".row.assessment-cap-nav",
            { style: "margin-top: 16px; padding: 0 12px;" },
            [
              m(
                ".col.s12.right-align",
                { style: "margin-bottom: 8px;" },
                m(LikertScale, {
                  label: t("action_priority"),
                  value: cap.actionPriority,
                  min: 1,
                  max: 5,
                  startLabel: t("action_priority_label_1"),
                  middleLabel: t("action_priority_label_3"),
                  endLabel: t("action_priority_label_5"),
                  showNumbers: true,
                  showTooltips: true,
                  tooltipLabels: [
                    t("action_priority_label_1"),
                    "2",
                    t("action_priority_label_3"),
                    "4",
                    t("action_priority_label_5"),
                  ],
                  layout: "horizontal",
                  density: "compact",
                  onchange: (v) => {
                    cap.actionPriority = v;
                    actions.saveModel(attrs, catModel);
                  },
                }),
              ),
              m(
                ".col.s4",
                prevCap &&
                  m(FlatButton, {
                    label: t("prev_cap"),
                    iconName: "arrow_back",
                    onclick: () =>
                      m.route.set(t("assessment_route"), { id: prevCap.id }),
                  }),
              ),
              m(
                ".col.s4.center-align",
                m(FlatButton, {
                  label: t("overview"),
                  iconName: "list",
                  onclick: () => actions.changePage(attrs, Pages.OVERVIEW),
                }),
              ),
              m(
                ".col.s4.right-align",
                nextCap &&
                  m(FlatButton, {
                    label: t("next_cap"),
                    iconName: "arrow_forward",
                    iconClass: "right",
                    onclick: () =>
                      m.route.set(t("assessment_route"), { id: nextCap.id }),
                  }),
              ),
            ],
          ),
        ],
      );
    },
  };
};
