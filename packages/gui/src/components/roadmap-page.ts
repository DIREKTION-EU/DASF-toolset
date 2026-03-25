import m from "mithril";
import { DatePicker, FlatButton, TextInput } from "mithril-materialized";
import { Pages, type CapabilityModel, type IRoadmapItem } from "../models";
import { actions, MeiosisComponent, t } from "../services";
import { PageNav } from "./ui";

export const RoadmapPage: MeiosisComponent = () => {
  return {
    oninit: ({ attrs }) => {
      actions.setPage(attrs, Pages.ROADMAP);
      const { catModel = {} as CapabilityModel } = attrs.state;
      const { data = {} } = catModel;
      if (
        (!data.roadmapItems || data.roadmapItems.length === 0) &&
        data.solutions &&
        data.solutions.length > 0
      ) {
        data.roadmapItems = data.solutions.map((sol) => ({
          solutionId: sol.id,
          priority: "medium" as const,
        }));
        actions.saveModel(attrs, catModel);
      }
    },
    view: ({ attrs }) => {
      const { catModel = { data: {} } as CapabilityModel } = attrs.state;
      const { data = {} } = catModel;
      const { solutions = [], roadmapItems = [] } = data;
      if (!data.roadmapItems) data.roadmapItems = roadmapItems;

      const getSolution = (id: string) => solutions.find((s) => s.id === id);
      const priorityColors: Record<string, string> = {
        low: "#4caf50",
        medium: "#ff9800",
        high: "#f44336",
      };
      const solutionsNotInRoadmap = solutions.filter(
        (s) => !roadmapItems.find((r) => r.solutionId === s.id),
      );

      return m(".roadmap.page", [
        m(PageNav, { ...attrs }),
        m(".row", [
          m(".col.s12", m("h4", t("roadmap_step_title"))),
          m(".col.s12", m("p", t("roadmap_step_desc"))),
        ]),

        // Add missing solutions button
        solutionsNotInRoadmap.length > 0 &&
          m(".row", [
            m(
              ".col.s12",
              m(FlatButton, {
                iconName: "playlist_add",
                label: t("roadmap_add_solutions", {
                  n: solutionsNotInRoadmap.length,
                }),
                onclick: () => {
                  const newItems: IRoadmapItem[] = solutionsNotInRoadmap.map(
                    (s) => ({
                      solutionId: s.id,
                      priority: "medium" as const,
                    }),
                  );
                  data.roadmapItems = [...roadmapItems, ...newItems];
                  actions.saveModel(attrs, catModel);
                },
              }),
            ),
          ]),

        // Roadmap table
        roadmapItems.length > 0
          ? m(".row", [
              m(".col.s12", [
                m("table.striped.highlight", [
                  m(
                    "thead",
                    m("tr", [
                      m("th", t("cap")),
                      m("th", "TRL"),
                      m("th", t("importance")),
                      m("th", t("start_time")),
                      m("th", t("proj_sum")),
                      m("th", ""),
                    ]),
                  ),
                  m(
                    "tbody",
                    roadmapItems.map((item) => {
                      const sol = getSolution(item.solutionId);
                      if (!sol) return null;
                      return m("tr", { key: item.solutionId }, [
                        m(
                          "td",
                          {
                            style: "cursor:pointer",
                            onclick: () =>
                              actions.openDrawer(
                                attrs,
                                "roadmap",
                                item.solutionId,
                              ),
                          },
                          [
                            m("strong", sol.label),
                            sol.url && m("br"),
                            sol.url &&
                              m(
                                "a.grey-text",
                                { href: sol.url, target: "_blank" },
                                sol.url,
                              ),
                          ],
                        ),
                        m("td", sol.trl || "-"),
                        m("td", [
                          m(
                            "select.browser-default",
                            {
                              value: item.priority || "medium",
                              style: `background: ${priorityColors[item.priority || "medium"]}20; border-radius: 4px;`,
                              onchange: (e: Event) => {
                                item.priority = (e.target as HTMLSelectElement)
                                  .value as "low" | "medium" | "high";
                                actions.saveModel(attrs, catModel);
                              },
                            },
                            [
                              m("option", { value: "low" }, t("priority_low")),
                              m(
                                "option",
                                { value: "medium" },
                                t("priority_medium"),
                              ),
                              m(
                                "option",
                                { value: "high" },
                                t("priority_high"),
                              ),
                            ],
                          ),
                        ]),
                        m("td", [
                          m(DatePicker, {
                            defaultValue: item.targetDate || "",
                            onchange: (v) => {
                              console.log(v);
                              item.targetDate = v;
                              actions.saveModel(attrs, catModel);
                            },
                          }),
                        ]),
                        m("td", [
                          m(TextInput, {
                            id: `commit-${item.solutionId}`,
                            defaultValue: item.commitment || "",
                            placeholder: t("proj_sum"),
                            onchange: (v) => {
                              item.commitment = v;
                              actions.saveModel(attrs, catModel);
                            },
                          }),
                        ]),
                        m(
                          "td",
                          m(FlatButton, {
                            iconName: "delete",
                            className: "red-text btn-small",
                            onclick: () => {
                              data.roadmapItems = roadmapItems.filter(
                                (r) => r.solutionId !== item.solutionId,
                              );
                              actions.saveModel(attrs, catModel);
                            },
                          }),
                        ),
                      ]);
                    }),
                  ),
                ]),
              ]),
            ])
          : m(
              ".row",
              m(
                ".col.s12.center.grey-text",
                { style: "padding: 40px;" },
                solutions.length === 0
                  ? m("p", t("roadmap_empty_solutions"))
                  : m("p", t("roadmap_empty")),
              ),
            ),

        // Visual timeline
        roadmapItems.length > 0 &&
          roadmapItems.some((r) => r.targetDate) &&
          m(".row", { style: "margin-top: 30px;" }, [
            m(".col.s12", m("h5", t("roadmap_timeline"))),
            m(
              ".col.s12",
              m(
                ".timeline-container",
                roadmapItems
                  .filter((r) => r.targetDate)
                  .sort((a, b) =>
                    (a.targetDate || "").localeCompare(b.targetDate || ""),
                  )
                  .map((item) => {
                    const sol = getSolution(item.solutionId);
                    if (!sol) return null;
                    return m(
                      ".timeline-item.card",
                      {
                        key: item.solutionId,
                        style: `border-left: 4px solid ${priorityColors[item.priority || "medium"]};`,
                      },
                      m(".card-content", [
                        m("span.card-title", sol.label),
                        m("p", [
                          m("strong", t("start_time") + ": "),
                          item.targetDate,
                          " | ",
                          m("strong", t("importance") + ": "),
                          m(
                            "span",
                            {
                              style: `color: ${priorityColors[item.priority || "medium"]}`,
                            },
                            item.priority || "medium",
                          ),
                        ]),
                        item.commitment && m("p.grey-text", item.commitment),
                      ]),
                    );
                  }),
              ),
            ),
          ]),
      ]);
    },
  };
};
