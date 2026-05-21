import m from "mithril";
import {
  Icon,
  LikertScale,
  Select,
  TextArea,
  TextInput,
  Tooltip,
} from "mithril-materialized";
import { InputField, resolveExpression, render } from "mithril-ui-form";
import { PluginType } from "mithril-ui-form";
import { ILabelled } from "../../models/capability-model/capability-model";
import { getTextColorFromBackground } from "../../utils";
import { t } from "../../services/translations";
import type {
  CollaborationPatch,
  CapabilityAssessmentResponseItem,
} from "../../services/collaboration-service";

// const range = (start: number, end: number) =>
//   Array.from({ length: end - start + 1 }, (_, k) => k + start);

type AssessmentType = {
  assessmentId?: string;
  items: Array<{
    id: string;
    value?: string;
    desc?: string;
    placeholder?: string;
  }>;
};

type AssessmentFieldType = InputField & {
  assessmentOptions: string;
  optionLabel: string;
  assessmentLabel: string;
  descriptionLabel: string;
  overallAssessment: "min" | "max" | "avg";
  overallAssessmentLabel: string;
  /** If set, the aspect can be ignored */
  excludeLabel?: string;
};

type ConsensusGhost = {
  capability?: {
    id?: string;
    label?: string;
    gaps?: unknown[];
    consensusJustifications?: Record<string, string>;
  };
  patches?: CollaborationPatch[];
  viewMode?: boolean;
};

type ParticipantComment = {
  initials: string;
  text: string;
};

const EXCLUDE_ID = "__exclude__id__";

const fallbackText = (key: string, fallback: string) => {
  const translated = t(key as any);
  const value = Array.isArray(translated)
    ? translated.join("")
    : translated == null
      ? ""
      : `${translated}`;
  return value && value !== key && value !== `@@${key}@@` ? value : fallback;
};

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

const translatedOrLiteral = (
  translated: unknown,
  key: string,
  fallback?: string,
) => {
  const value = Array.isArray(translated)
    ? translated.join("")
    : translated == null
      ? ""
      : `${translated}`;
  if (value && value !== key && value !== `@@${key}@@`) return value;
  return fallback || key;
};

const textValueFromEvent = (valueOrEvent: unknown) => {
  if (typeof valueOrEvent === "string") return valueOrEvent;
  if (
    valueOrEvent &&
    typeof valueOrEvent === "object" &&
    "target" in valueOrEvent
  ) {
    const target = (valueOrEvent as { target?: { value?: unknown } }).target;
    return typeof target?.value === "string" ? target.value : "";
  }
  return "";
};

const contributorInitials = (value: string) =>
  value
    .replace(/@.*$/, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "?";

const ghostFromContext = (context: unknown) =>
  (context instanceof Array
    ? context.find(
        (entry) =>
          !!entry && typeof entry === "object" && "__consensusGhost" in entry,
      )
    : undefined) as { __consensusGhost?: ConsensusGhost } | undefined;

const justificationKey = (
  fieldId: string,
  itemId: string,
  gapIndex?: number,
) =>
  fieldId === "taskAssessment"
    ? `task:${itemId}`
    : fieldId === "performanceAssessment"
      ? `performance:${itemId}`
      : `gap:${gapIndex ?? 0}:${itemId}`;

const collectConsensus = (
  patches: CollaborationPatch[] = [],
  capabilityId: string,
  fieldId: string,
  itemId: string,
  gapIndex?: number,
): {
  counts: Record<string, number>;
  modeId?: string;
  totalVotes: number;
  comments: ParticipantComment[];
} => {
  const counts: Record<string, number> = {};
  const comments: ParticipantComment[] = [];

  patches.forEach((patch, index) => {
    const answer = (patch.ca ?? []).find((entry) => entry.c === capabilityId);
    if (!answer) return;
    const items: CapabilityAssessmentResponseItem[] | undefined =
      fieldId === "taskAssessment"
        ? answer.ta?.i
        : fieldId === "performanceAssessment"
          ? answer.pa?.i
          : answer.g?.[gapIndex ?? -1]?.i;
    const item = items?.find((entry) => entry.id === itemId);
    if (!item) return;
    if (item.v) counts[item.v] = (counts[item.v] ?? 0) + 1;
    if (item.d?.trim()) {
      comments.push({
        initials: contributorInitials(
          patch.un?.trim() || patch.ue?.trim() || `${index + 1}`,
        ),
        text: item.d.trim(),
      });
    }
  });

  const modeId = Object.entries(counts)
    .sort((left, right) => right[1] - left[1])
    .shift()?.[0];

  return {
    counts,
    modeId,
    totalVotes: Object.values(counts).reduce((sum, value) => sum + value, 0),
    comments,
  };
};

const renderHistogram = (
  score: ILabelled[],
  counts: Record<string, number>,
  modeId?: string,
) => {
  const totalVotes = Object.values(counts).reduce(
    (sum, value) => sum + value,
    0,
  );
  if (!score.length || totalVotes === 0) return null;
  const maxCount = Math.max(1, ...score.map((item) => counts[item.id] ?? 0));
  return m(
    ".dasf-micro-histogram",
    score.map((item) => {
      const count = counts[item.id] ?? 0;
      return m(".dasf-micro-histogram__bar-wrap", [
        m("span.dasf-micro-histogram__count", count),
        m("span.dasf-micro-histogram__rail", [
          m("span.dasf-micro-histogram__bar", {
            class: item.id === modeId ? "is-mode" : "",
            style: `height: ${count ? Math.max(16, (count / maxCount) * 42) : 6}px`,
          }),
        ]),
        m("span.dasf-micro-histogram__label", item.label),
      ]);
    }),
  );
};

const renderComments = (comments: ParticipantComment[]) => {
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

export const assessmentPlugin: PluginType = () => {
  let key = 1;

  const computeOutcome = (
    overallAssessment: "max" | "min" | "avg",
    score: false | ILabelled[],
    items: Array<{ value?: string }>,
  ) =>
    items.every((i) => typeof i.value === "undefined" || i.value === EXCLUDE_ID)
      ? undefined
      : score &&
        Math.round(
          items
            .filter((i) => i.value && i.value !== EXCLUDE_ID)
            .reduce((acc, cur, _i, arr) => {
              const index = score.findIndex((s) => s.id === cur.value);
              return index < 0
                ? acc
                : overallAssessment === "max"
                  ? Math.max(index, acc)
                  : overallAssessment === "min"
                    ? Math.min(index, acc)
                    : acc + index / arr.length;
            }, 0),
        );

  return {
    view: ({ attrs: { field, obj, context = [], onchange } }) => {
      const {
        id = "",
        options = "",
        assessmentOptions = "",
        optionLabel,
        assessmentLabel,
        descriptionLabel = "desc",
        overallAssessment,
        overallAssessmentLabel,
        readonly,
        excludeLabel,
      } = field as AssessmentFieldType;
      const fieldId = `${id}`;
      if (obj instanceof Array) return;
      if (!obj.hasOwnProperty(id))
        obj[id] = { assessmentId: "", items: [] } as AssessmentType;

      const disabled = readonly;
      const ctx = context instanceof Array ? [obj, ...context] : [obj, context];
      const ghost = ghostFromContext(context)?.__consensusGhost;
      const capabilityId = ghost?.capability?.id;
      const capabilityName =
        (capabilityId &&
          translatedOrLiteral(
            t(capabilityId as any),
            capabilityId,
            ghost?.capability?.label,
          )) ||
        ghost?.capability?.label ||
        fallbackText("cap", "the current capability");
      const gapIndex =
        fieldId === "gapAssessment" && ghost?.capability?.gaps instanceof Array
          ? ghost.capability.gaps.indexOf(obj as unknown)
          : undefined;
      const opt =
        typeof options === "string" &&
        (resolveExpression(options, ctx) as ILabelled[]);
      let items = (obj[id] as AssessmentType).items;
      if (opt instanceof Array && items instanceof Array) {
        const values = items.reduce((acc, cur) => {
          acc.set(cur.id, { value: cur.value, desc: cur.desc });
          return acc;
        }, new Map<string, { value?: string; desc?: string }>());
        items.length = 0;
        items.push(
          ...opt
            .filter((o) => !excludeLabel || o.id !== EXCLUDE_ID)
            .map((item) => ({
              ...item,
              placeholder: item.desc,
              desc: undefined,
              ...values.get(item.id),
            })),
        );
        (obj[id] as AssessmentType).items = items;
      }
      // console.log(`Assessment plugin ${optionLabel}: ${JSON.stringify(items)}`);

      const score =
        typeof options === "string" &&
        (resolveExpression(assessmentOptions, ctx) as ILabelled[]).map(
          (i) => i,
        );
      if (score && excludeLabel) {
        score.push({
          id: EXCLUDE_ID,
          label: t(excludeLabel as any),
        });
      }

      const outcomeIndex =
        typeof overallAssessment !== "undefined" &&
        computeOutcome(overallAssessment, score, items);
      const outcome =
        typeof outcomeIndex === "number" && score && score.length > outcomeIndex
          ? score[outcomeIndex]
          : { label: t("TBD"), color: "" };

      const assessmentStarted = items.filter((i) => i.value).length > 0;
      const color =
        assessmentStarted && outcome.color ? outcome.color : "#f0f8ff";

      const gapLikertFields = [
        {
          id: "gapSeverity",
          labelKey: "gap_likert_severity",
          tooltipKey: "gap_likert_severity_tooltip",
          fallbackLabel: "Severity",
          fallbackTooltip:
            "How do you rate the severity of this capability gap?",
        },
        {
          id: "gapProbability",
          labelKey: "gap_likert_probability",
          tooltipKey: "gap_likert_probability_tooltip",
          fallbackLabel: "Probability",
          fallbackTooltip:
            "Suppose the gap is solved: What would this mean for the probability of occurrence of the gap?",
        },
        {
          id: "gapImpact",
          labelKey: "gap_likert_impact",
          tooltipKey: "gap_likert_impact_tooltip",
          fallbackLabel: "Impact",
          fallbackTooltip:
            "Suppose the gap is solved. What would this mean for the reduction in impact of the original gap?",
        },
      ] as const;

      return m(".assessment-plugin.section", [
        // m('.divider'),
        overallAssessmentLabel &&
          m(
            ".col.s12.right-align",
            m(
              `.assessment-score.en${getTextColorFromBackground(color)}`,
              {
                style: { background: color },
              },
              [
                m("strong", `${t(overallAssessmentLabel as any)}: `),
                m("span", assessmentStarted ? outcome.label : t("TBD")),
              ],
            ),
          ),
        m("div", [
          fieldId === "taskAssessment" &&
            m(
              ".col.s12",
              m(
                "em",
                fallbackTextWithVars(
                  "assess_capability_importance_for_capability",
                  `Assess the importance of \"${capabilityName}\" for the chosen scope.`,
                  { capability: capabilityName },
                ),
              ),
            ),
          fieldId === "performanceAssessment" &&
            m(
              ".col.s12",
              m(
                "em",
                fallbackTextWithVars(
                  "assess_performance_aspects_for_capability",
                  `Assess the Performance Aspects of "${capabilityName}".`,
                  { capability: capabilityName },
                ),
              ),
            ),
          fieldId === "gapAssessment" &&
            m(
              ".col.s12",
              { style: "margin-top: 12px;" },
              m(
                "em",
                fallbackText(
                  "gap_problem_categories_intro",
                  "Analyse this capability gap on the following problem categories.",
                ),
              ),
            ),
          m(".col.s8.m6.l4", m("h6", m("strong", t(optionLabel as any)))),
          m(".col.s4.m3.l3", m("h6", m("strong", t(assessmentLabel as any)))),
          m(".col.s12.m3.l5", m("h6", m("strong", t(descriptionLabel as any)))),
          opt &&
            score &&
            opt.length > 0 &&
            opt.map((o, i) => {
              const existing = items.filter((i) => i.id === o.id).shift();
              if (!existing) items.push({ id: o.id });
              const item = existing || items[items.length - 1];
              const consensus =
                capabilityId && score
                  ? collectConsensus(
                      ghost?.patches,
                      capabilityId,
                      fieldId,
                      o.id,
                      gapIndex,
                    )
                  : {
                      counts: {},
                      modeId: undefined,
                      totalVotes: 0,
                      comments: [],
                    };
              const override =
                !!item.value &&
                !!consensus.modeId &&
                item.value !== consensus.modeId &&
                item.value !== EXCLUDE_ID;
              const noteKey = justificationKey(fieldId, o.id, gapIndex);
              const justification =
                ghost?.capability?.consensusJustifications?.[noteKey] ?? "";
              const itemDescription =
                fieldId === "performanceAssessment" && o.id === "PA-1"
                  ? fallbackTextWithVars(
                      "perf_effectiveness_tooltip",
                      `How effective is ${capabilityName}?`,
                      { capability: capabilityName },
                    )
                  : fieldId === "performanceAssessment" && o.id === "PA-2"
                    ? fallbackTextWithVars(
                        "perf_safety_professionals_tooltip",
                        `What is the level of the physical and mental safety of operational personnel working on ${capabilityName}?`,
                        { capability: capabilityName },
                      )
                    : fieldId === "performanceAssessment" && o.id === "PA-3"
                      ? fallbackTextWithVars(
                          "perf_efficiency_tooltip",
                          `How efficient is ${capabilityName}?`,
                          { capability: capabilityName },
                        )
                      : o.desc;
              return m(".col.s12", [
                m(".row.condensed", [
                  m(
                    ".col.s8.m6.l4.truncate",
                    {
                      style: "margin: 14px auto 0 auto;",
                      className:
                        item.value === EXCLUDE_ID ? "disabled-option" : "",
                    },
                    o.label,
                    itemDescription &&
                      m(
                        "span.tooltipped.grey-text.info-icon",
                        {
                          "data-position": "bottom",
                          "data-tooltip": `<div class="left-align">${render(
                            itemDescription,
                          ).replace(
                            /<ul/,
                            '<ul class="browser-default"',
                          )}</div>`,
                          oncreate: ({ dom }) =>
                            new Tooltip(dom as HTMLElement),
                          onremove: ({ dom }) =>
                            Tooltip.getInstance(dom as HTMLElement)?.destroy(),
                        },
                        m(Icon, { iconName: "info" }),
                      ),
                  ),
                  m(".col.s4.m3.l3", [
                    renderHistogram(score, consensus.counts, consensus.modeId),
                    m(
                      ".row",
                      {
                        className: [
                          item.value === EXCLUDE_ID ? "disabled-option" : "",
                          override ? "dasf-consensus-override" : "",
                        ]
                          .filter(Boolean)
                          .join(" "),
                      },
                      disabled
                        ? m(TextInput, {
                            disabled,
                            value: score
                              .filter((s) => s.id === item.value)
                              .shift()?.label,
                          })
                        : [
                            m(Select, {
                              key: `select_${key}_${i}`,
                              placeholder: t("pick_one"),
                              options: score,
                              className: "col s10",
                              checkedId: item.value,
                              onchange: (v) => {
                                item.value = v[0] as string;
                                const o = computeOutcome(
                                  overallAssessment,
                                  score,
                                  items,
                                );
                                (obj[id] as AssessmentType).assessmentId =
                                  typeof o === "number"
                                    ? score[o].id
                                    : undefined;
                                onchange && onchange(obj[id]);
                              },
                            }),
                            m(Icon, {
                              key: "icon",
                              iconName: "clear",
                              className: "tiny left-align clickable",
                              style: "line-height: 48px",
                              onclick: () => {
                                if (item.value) {
                                  item.value = undefined;
                                  key++;
                                  const o = computeOutcome(
                                    overallAssessment,
                                    score,
                                    items,
                                  );
                                  (obj[id] as AssessmentType).assessmentId =
                                    typeof o === "number"
                                      ? score[o].id
                                      : undefined;
                                  onchange && onchange(obj[id]);
                                }
                              },
                            }),
                          ],
                    ),
                  ]),
                  m(".col.s12.m3.l5", [
                    (() => {
                      const updateDescription = (valueOrEvent: unknown) => {
                        item.desc = textValueFromEvent(valueOrEvent);
                        onchange && onchange(obj[id]);
                        const o = computeOutcome(
                          overallAssessment,
                          score,
                          items,
                        );
                        if (typeof o === "number")
                          (obj[id] as AssessmentType).assessmentId =
                            score[o].id;
                      };
                      return m(
                        ".row",
                        m(TextArea, {
                          disabled,
                          placeholder: item.placeholder,
                          value: item.desc,
                          oninput: updateDescription,
                          onchange: updateDescription,
                        }),
                      );
                    })(),
                    renderComments(consensus.comments),
                  ]),
                ]),
                override &&
                  m(".row", [
                    m(
                      ".col.s12.l8.offset-l4",
                      (() => {
                        const updateJustification = (valueOrEvent: unknown) => {
                          if (!ghost?.capability) return;
                          ghost.capability.consensusJustifications = {
                            ...(ghost.capability.consensusJustifications ?? {}),
                            [noteKey]: textValueFromEvent(valueOrEvent),
                          };
                          onchange && onchange(obj[id]);
                        };
                        return m(TextArea, {
                          label: fallbackText(
                            "facilitator_justification",
                            "Facilitator justification",
                          ),
                          placeholder: fallbackText(
                            "facilitator_justification_placeholder",
                            "Explain why the final value differs from the participant consensus.",
                          ),
                          value: justification,
                          className: justification
                            ? ""
                            : "dasf-justification-required",
                          oninput: updateJustification,
                          onchange: updateJustification,
                        });
                      })(),
                    ),
                  ]),
              ]);
            }),
          fieldId === "gapAssessment" &&
            m(
              ".col.s12",
              { style: "margin-top: 16px;" },
              m(
                ".row",
                gapLikertFields.map((gapLikert) => {
                  const value =
                    typeof (obj as Record<string, unknown>)[gapLikert.id] ===
                    "number"
                      ? ((obj as Record<string, unknown>)[
                          gapLikert.id
                        ] as number)
                      : undefined;
                  const tooltipText = fallbackText(
                    gapLikert.tooltipKey,
                    gapLikert.fallbackTooltip,
                  );
                  return m(".col.s12.m6.l4.condensed", [
                    m("label.dasf-field-label", [
                      fallbackText(gapLikert.labelKey, gapLikert.fallbackLabel),
                      m(
                        "span.tooltipped.grey-text.info-icon",
                        {
                          "data-position": "bottom",
                          "data-tooltip": tooltipText,
                          oncreate: ({ dom }) =>
                            new Tooltip(dom as HTMLElement),
                          onremove: ({ dom }) =>
                            Tooltip.getInstance(dom as HTMLElement)?.destroy(),
                        },
                        m(Icon, { iconName: "info" }),
                      ),
                    ]),
                    m(LikertScale, {
                      min: 1,
                      max: 5,
                      value,
                      showNumbers: true,
                      startLabel: fallbackText(
                        `${gapLikert.labelKey}_start_label`,
                        gapLikert.id === "gapSeverity"
                          ? "Very low"
                          : "No change",
                      ),
                      middleLabel: fallbackText(
                        `${gapLikert.labelKey}_middle_label`,
                        gapLikert.id === "gapSeverity" ? "Average" : "—",
                      ),
                      endLabel: fallbackText(
                        `${gapLikert.labelKey}_end_label`,
                        gapLikert.id === "gapSeverity"
                          ? "Very high"
                          : "Big decrease",
                      ),
                      layout: "horizontal",
                      density: "compact",
                      disabled,
                      onchange: (nextValue) => {
                        (obj as Record<string, unknown>)[gapLikert.id] =
                          nextValue;
                        onchange && onchange(obj[id]);
                      },
                    }),
                  ]);
                }),
              ),
            ),
        ]),
      ]);
    },
  };
};
