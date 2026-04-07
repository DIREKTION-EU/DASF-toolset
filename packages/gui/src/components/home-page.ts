import m from "mithril";
import { Button, Icon } from "mithril-materialized";
import { routingSvc, MeiosisComponent, actions, t } from "../services";
import { type CapabilityModel, type ISolution, Pages } from "../models";
import { PageNav } from "./ui";

const priorityColors: Record<string, string> = {
  low: "#4caf50",
  medium: "#ff9800",
  high: "#f44336",
};

const tag = (text: string, color = "#1565c0") =>
  m(
    "span",
    {
      style: `display:inline-block; padding:2px 8px; border-radius:10px; font-size:11px;
              background:${color}20; color:${color}; margin:2px 3px 2px 0; white-space:nowrap;`,
    },
    text,
  );

const statusDot = (color: string | undefined, title?: string) =>
  m("span", {
    title,
    style: `display:inline-block; width:10px; height:10px; border-radius:50%;
            background:${color || "#9e9e9e"}; border:1px solid rgba(0,0,0,0.2);
            margin-right:6px; flex-shrink:0;`,
  });

const sectionLink = (label: string, page: Pages) =>
  m(
    "a",
    {
      href: "#",
      style: "font-size:12px; margin-left:8px;",
      onclick: (e: Event) => {
        e.preventDefault();
        routingSvc.switchTo(page);
      },
    },
    label,
  );

const complianceScore = (sol: ISolution) => {
  const checks = (sol.compliance || []).filter(
    (c) => c.value && c.value !== "na",
  );
  if (checks.length === 0) return null;
  const pass = checks.filter((c) => c.value === "pass").length;
  const partial = checks.filter((c) => c.value === "partial").length;
  const fail = checks.filter((c) => c.value === "fail").length;
  const score = Math.round(((pass + partial * 0.5) / checks.length) * 100);
  const color = score >= 70 ? "#4caf50" : score >= 40 ? "#ff9800" : "#f44336";
  return m(
    "span",
    {
      title: `Pass: ${pass}, Partial: ${partial}, Fail: ${fail}`,
      style: `font-size:11px; font-weight:600; color:${color}; margin-left:6px;`,
    },
    `${score}% compliance`,
  );
};

export const HomePage: MeiosisComponent = () => {
  return {
    oninit: ({ attrs }) => {
      actions.setPage(attrs, Pages.HOME);
    },
    view: ({ attrs }) => {
      const { catModel = {} as CapabilityModel, currentSessionId } =
        attrs.state;
      const { data = {} } = catModel;
      const {
        enabledSteps = [0, 1, 2, 3],
        hazardTypes = [],
        selectedHazardIds = [],
        capabilities = [],
        solutions = [],
        roadmapItems = [],
        stakeholders = [],
        assessmentScale = [],
        gapScale = [],
      } = data;

      if (!currentSessionId) {
        routingSvc.switchTo(Pages.LANDING);
        return null;
      }

      const selectedHazards = hazardTypes.filter(
        (h) => selectedHazardIds.includes(h.id) || h.selected,
      );
      const assessedCapabilities = capabilities.filter((c) => c.assessmentId);
      const capsWithGaps = capabilities.filter(
        (c) => c.gaps && c.gaps.length > 0,
      );

      const getStakeholderLabel = (id: string) =>
        stakeholders.find((s) => s.id === id)?.label || id;

      const getCapLabel = (id: string) =>
        (t(id as any) as string) ||
        capabilities.find((c) => c.id === id)?.label ||
        id;

      const getHazardLabel = (id: string) =>
        (t(id as any) as string) ||
        hazardTypes.find((h) => h.id === id)?.label ||
        id;

      const steps = [
        {
          step: 0,
          title: t("step0_title"),
          icon: "warning",
          page: Pages.HAZARDS,
          summary: `${selectedHazards.length} ${t("selected_hazards").toLowerCase()}`,
          color: selectedHazards.length > 0 ? "#4caf50" : "#ff9800",
        },
        {
          step: 1,
          title: t("step1_title"),
          icon: "assessment",
          page: Pages.OVERVIEW,
          summary: `${assessedCapabilities.length}/${capabilities.length} ${t("caps").toLowerCase()}, ${capsWithGaps.length} ${t("gaps").toLowerCase()}`,
          color: assessedCapabilities.length > 0 ? "#4caf50" : "#ff9800",
        },
        {
          step: 2,
          title: t("step2_title"),
          icon: "lightbulb",
          page: Pages.SOLUTIONS,
          summary: t("solution_count", solutions.length),
          color: solutions.length > 0 ? "#4caf50" : "#ff9800",
        },
        {
          step: 3,
          title: t("step3_title"),
          icon: "timeline",
          page: Pages.ROADMAP,
          summary: t("roadmap_count", roadmapItems.length),
          color: roadmapItems.length > 0 ? "#4caf50" : "#ff9800",
        },
      ].filter((s) => enabledSteps.includes(s.step));

      const hasSummary =
        selectedHazards.length > 0 ||
        capsWithGaps.length > 0 ||
        solutions.length > 0 ||
        roadmapItems.length > 0;

      return m(".dashboard.page", [
        m(PageNav, { ...attrs }),
        m(".row", [
          m(".col.s12", [
            m("h4", data.title || "DASF Assessment"),
            m("p.grey-text", t("dashboard_subtitle")),
          ]),
        ]),

        // Step cards
        m(
          ".row.dasf-step-cards",
          steps.map((s) =>
            m(
              ".col.s12.m6.l3",
              { key: s.step },
              m(
                ".card.hoverable.dasf-step-card",
                {
                  style: `border-top: 4px solid ${s.color}; cursor: pointer; height: 100%;`,
                  onclick: () => routingSvc.switchTo(s.page),
                },
                [
                  m(".card-content", [
                    m("span.card-title", [
                      m(".dasf-step-number", `${s.step}`),
                      m(Icon, {
                        iconName: s.icon,
                        style: "margin-left: 8px; vertical-align: middle;",
                      }),
                    ]),
                    m("h6", s.title),
                    m("p.grey-text", s.summary),
                  ]),
                  m(".card-action", [
                    m(
                      "a",
                      {
                        href: "#",
                        onclick: (e: Event) => {
                          e.preventDefault();
                          routingSvc.switchTo(s.page);
                        },
                      },
                      t("continue"),
                    ),
                  ]),
                ],
              ),
            ),
          ),
        ),

        // Summary section
        hasSummary &&
          m(".row", { style: "margin-top: 20px;" }, [
            m(".col.s12", m("h5", t("summary"))),

            // Hazards
            selectedHazards.length > 0 &&
              m(".col.s12", { style: "margin-bottom: 16px;" }, [
                m("h6", [
                  m(Icon, {
                    iconName: "warning",
                    style:
                      "font-size:1.1rem; vertical-align:middle; margin-right:4px;",
                  }),
                  t("selected_hazards"),
                  sectionLink(t("continue"), Pages.HAZARDS),
                ]),
                selectedHazards.map((h) => {
                  const relatedCaps = capsWithGaps.filter((c) =>
                    (c.hazardIds || []).includes(h.id),
                  );
                  return m(
                    ".card",
                    {
                      key: h.id,
                      style: "margin: 4px 0; padding: 10px 14px;",
                    },
                    [
                      m(
                        "div",
                        {
                          style:
                            "display:flex; align-items:baseline; gap:8px; flex-wrap:wrap;",
                        },
                        [
                          m("strong", (t(h.id as any) as string) || h.label),
                          h.category && tag(h.category, "#607d8b"),
                        ],
                      ),
                      h.description &&
                        m(
                          "p",
                          {
                            style:
                              "margin: 4px 0 6px; font-size:13px; color:var(--mm-text-muted, #666);",
                          },
                          h.description,
                        ),
                      relatedCaps.length > 0 &&
                        m("div", { style: "margin-top:4px;" }, [
                          m(
                            "span",
                            {
                              style:
                                "font-size:11px; color:#888; margin-right:4px;",
                            },
                            t("capability_gaps") + ":",
                          ),
                          relatedCaps.map((c) =>
                            tag(getCapLabel(c.id), "#e65100"),
                          ),
                        ]),
                    ],
                  );
                }),
              ]),

            // Capability gaps
            capsWithGaps.length > 0 &&
              m(".col.s12", { style: "margin-bottom: 16px;" }, [
                m("h6", [
                  m(Icon, {
                    iconName: "report_problem",
                    style:
                      "font-size:1.1rem; vertical-align:middle; margin-right:4px;",
                  }),
                  t("capability_gaps"),
                  sectionLink(t("continue"), Pages.OVERVIEW),
                ]),
                capsWithGaps.map((cap) => {
                  const capAssessment = assessmentScale.find(
                    (a) => a.id === cap.assessmentId,
                  );
                  const capStakeholders = Array.isArray(
                    cap.capabilityStakeholders,
                  )
                    ? cap.capabilityStakeholders
                    : cap.capabilityStakeholders
                      ? [cap.capabilityStakeholders]
                      : [];
                  const capHazards = hazardTypes.filter((h) =>
                    (cap.hazardIds || []).includes(h.id),
                  );
                  const capSolutions = solutions.filter((s) =>
                    (s.capabilityIds || []).includes(cap.id),
                  );

                  return m(
                    ".card",
                    { key: cap.id, style: "margin: 4px 0;" },
                    m(".card-content", { style: "padding: 10px 14px;" }, [
                      m(
                        "div",
                        {
                          style:
                            "display:flex; align-items:center; margin-bottom:6px;",
                        },
                        [
                          statusDot(capAssessment?.color, capAssessment?.label),
                          m("strong", getCapLabel(cap.id)),
                        ],
                      ),
                      (cap.gaps || []).map((gap, i) => {
                        const gapStatus = gapScale.find(
                          (g) => g.id === gap.gapAssessment?.assessmentId,
                        );
                        return m(
                          "div",
                          {
                            key: i,
                            style:
                              "border-left: 3px solid #e0e0e0; padding-left: 10px; margin: 6px 0;",
                          },
                          [
                            m(
                              "div",
                              { style: "display:flex; align-items:center;" },
                              [
                                statusDot(gapStatus?.color, gapStatus?.label),
                                m(
                                  "span",
                                  { style: "font-weight:500; font-size:13px;" },
                                  gap.title || `Gap ${i + 1}`,
                                ),
                              ],
                            ),
                            gap.desc &&
                              m(
                                "p",
                                {
                                  style:
                                    "margin: 3px 0 4px 16px; font-size:12px; color:var(--mm-text-muted, #666);",
                                },
                                gap.desc,
                              ),
                            (capStakeholders.length > 0 ||
                              capHazards.length > 0 ||
                              capSolutions.length > 0) &&
                              m(
                                "div",
                                { style: "margin-left:16px; margin-top:4px;" },
                                [
                                  capStakeholders.length > 0 &&
                                    m("div", [
                                      m(
                                        "span",
                                        {
                                          style:
                                            "font-size:11px; color:#888; margin-right:4px;",
                                        },
                                        t("shs") + ":",
                                      ),
                                      capStakeholders.map((id) =>
                                        tag(getStakeholderLabel(id), "#1565c0"),
                                      ),
                                    ]),
                                  capHazards.length > 0 &&
                                    m("div", { style: "margin-top:2px;" }, [
                                      m(
                                        "span",
                                        {
                                          style:
                                            "font-size:11px; color:#888; margin-right:4px;",
                                        },
                                        t("drawer_relevant_hazards") + ":",
                                      ),
                                      capHazards.map((h) =>
                                        tag(getHazardLabel(h.id), "#bf360c"),
                                      ),
                                    ]),
                                  capSolutions.length > 0 &&
                                    m("div", { style: "margin-top:2px;" }, [
                                      m(
                                        "span",
                                        {
                                          style:
                                            "font-size:11px; color:#888; margin-right:4px;",
                                        },
                                        t("solutions") + ":",
                                      ),
                                      capSolutions.map((s) =>
                                        tag(s.label, "#1b5e20"),
                                      ),
                                    ]),
                                ],
                              ),
                          ],
                        );
                      }),
                    ]),
                  );
                }),
              ]),

            // Solutions
            solutions.length > 0 &&
              m(".col.s12", { style: "margin-bottom: 16px;" }, [
                m("h6", [
                  m(Icon, {
                    iconName: "lightbulb",
                    style:
                      "font-size:1.1rem; vertical-align:middle; margin-right:4px;",
                  }),
                  t("solutions"),
                  sectionLink(t("continue"), Pages.SOLUTIONS),
                ]),
                solutions.map((sol) => {
                  const linkedCaps = capabilities.filter((c) =>
                    (sol.capabilityIds || []).includes(c.id),
                  );
                  const linkedHazards = hazardTypes.filter((h) =>
                    linkedCaps.some((c) => (c.hazardIds || []).includes(h.id)),
                  );

                  return m(
                    ".card",
                    { key: sol.id, style: "margin: 4px 0;" },
                    m(".card-content", { style: "padding: 10px 14px;" }, [
                      m(
                        "div",
                        {
                          style:
                            "display:flex; align-items:baseline; flex-wrap:wrap; gap:8px; margin-bottom:4px;",
                        },
                        [
                          m("strong", sol.label),
                          sol.trl !== undefined &&
                            tag(`TRL ${sol.trl}`, "#1565c0"),
                          complianceScore(sol),
                        ],
                      ),
                      sol.desc &&
                        m(
                          "p",
                          {
                            style:
                              "margin: 4px 0 6px; font-size:13px; color:var(--mm-text-muted, #666);",
                          },
                          sol.desc,
                        ),
                      (linkedHazards.length > 0 || linkedCaps.length > 0) &&
                        m("div", { style: "margin-top:4px;" }, [
                          linkedHazards.length > 0 &&
                            m("div", [
                              m(
                                "span",
                                {
                                  style:
                                    "font-size:11px; color:#888; margin-right:4px;",
                                },
                                t("drawer_relevant_hazards") + ":",
                              ),
                              linkedHazards.map((h) =>
                                tag(getHazardLabel(h.id), "#bf360c"),
                              ),
                            ]),
                          linkedCaps.length > 0 &&
                            m("div", { style: "margin-top:2px;" }, [
                              m(
                                "span",
                                {
                                  style:
                                    "font-size:11px; color:#888; margin-right:4px;",
                                },
                                t("capability_gaps") + ":",
                              ),
                              linkedCaps.map((c) =>
                                tag(getCapLabel(c.id), "#e65100"),
                              ),
                            ]),
                        ]),
                    ]),
                  );
                }),
              ]),

            // Roadmap
            roadmapItems.length > 0 &&
              m(".col.s12", { style: "margin-bottom: 16px;" }, [
                m("h6", [
                  m(Icon, {
                    iconName: "timeline",
                    style:
                      "font-size:1.1rem; vertical-align:middle; margin-right:4px;",
                  }),
                  t("roadmap_step_title"),
                  sectionLink(t("continue"), Pages.ROADMAP),
                ]),
                m("table.striped.highlight", [
                  m(
                    "thead",
                    m("tr", [
                      m("th", t("cap")),
                      m("th", "TRL"),
                      m("th", t("importance")),
                      m("th", t("start_time")),
                      m("th", t("proj_sum")),
                    ]),
                  ),
                  m(
                    "tbody",
                    roadmapItems.map((item) => {
                      const sol = solutions.find(
                        (s) => s.id === item.solutionId,
                      );
                      if (!sol) return null;
                      const prio = item.priority || "medium";
                      return m("tr", { key: item.solutionId }, [
                        m(
                          "td",
                          {
                            style: "cursor:pointer",
                            onclick: () => routingSvc.switchTo(Pages.ROADMAP),
                          },
                          m("strong", sol.label),
                        ),
                        m("td", sol.trl !== undefined ? `${sol.trl}` : "-"),
                        m("td", [
                          m(
                            "span",
                            {
                              style: `background:${priorityColors[prio]}20; color:${priorityColors[prio]};
                                      padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600;`,
                            },
                            prio,
                          ),
                        ]),
                        m("td", item.targetDate || "-"),
                        m(
                          "td",
                          {
                            style:
                              "max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;",
                          },
                          item.commitment || "-",
                        ),
                      ]);
                    }),
                  ),
                ]),
              ]),
          ]),

        // Back to sessions
        m(".row", { style: "margin-top: 30px;" }, [
          m(".col.s12", [
            m(Button, {
              iconName: "arrow_back",
              label: t("back_to_sessions"),
              className: "btn-flat",
              onclick: () => routingSvc.switchTo(Pages.LANDING),
            }),
          ]),
        ]),
      ]);
    },
  };
};
