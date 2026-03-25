import m from "mithril";
import { Button, Icon } from "mithril-materialized";
import { routingSvc, MeiosisComponent, actions, t } from "../services";
import { type CapabilityModel, Pages } from "../models";
import { PageNav } from "./ui";

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
        enabledSteps = [1, 2, 3, 4],
        hazardTypes = [],
        selectedHazardIds = [],
        capabilities = [],
        solutions = [],
        roadmapItems = [],
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

      const steps = [
        {
          step: 1,
          title: t("step1_title"),
          icon: "warning",
          page: Pages.HAZARDS,
          summary: `${selectedHazards.length} ${t("selected_hazards").toLowerCase()}`,
          color: selectedHazards.length > 0 ? "#4caf50" : "#ff9800",
        },
        {
          step: 2,
          title: t("step2_title"),
          icon: "assessment",
          page: Pages.OVERVIEW,
          summary: `${assessedCapabilities.length}/${capabilities.length} ${t("caps").toLowerCase()}, ${capsWithGaps.length} ${t("gaps").toLowerCase()}`,
          color: assessedCapabilities.length > 0 ? "#4caf50" : "#ff9800",
        },
        {
          step: 3,
          title: t("step3_title"),
          icon: "lightbulb",
          page: Pages.SOLUTIONS,
          summary: t("solution_count", solutions.length),
          color: solutions.length > 0 ? "#4caf50" : "#ff9800",
        },
        {
          step: 4,
          title: t("step4_title"),
          icon: "timeline",
          page: Pages.ROADMAP,
          summary: t("roadmap_count", roadmapItems.length),
          color: roadmapItems.length > 0 ? "#4caf50" : "#ff9800",
        },
      ].filter((s) => enabledSteps.includes(s.step));

      return m(".dashboard.page", [
        m(PageNav, { ...attrs }),
        m(".row", [
          m(".col.s12", [
            m("h4", data.title || "DASF Assessment"),
            m("p.grey-text", t("dashboard_subtitle")),
          ]),
        ]),

        // Step cards — use flex row so all cards match height
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
        (selectedHazards.length > 0 ||
          capsWithGaps.length > 0 ||
          solutions.length > 0) &&
          m(".row", { style: "margin-top: 20px;" }, [
            m(".col.s12", m("h5", t("summary"))),
            selectedHazards.length > 0 &&
              m(".col.s12.m4", [
                m("h6", t("selected_hazards")),
                m(
                  "ul.collection",
                  selectedHazards
                    .slice(0, 5)
                    .map((h) => m("li.collection-item", h.label)),
                ),
                selectedHazards.length > 5 &&
                  m(
                    "p.grey-text",
                    `...${selectedHazards.length - 5} ${t("more").toLowerCase()}`,
                  ),
              ]),
            capsWithGaps.length > 0 &&
              m(".col.s12.m4", [
                m("h6", t("capability_gaps")),
                m(
                  "ul.collection",
                  capsWithGaps
                    .slice(0, 5)
                    .map((c) => m("li.collection-item", c.label)),
                ),
                capsWithGaps.length > 5 &&
                  m(
                    "p.grey-text",
                    `...${capsWithGaps.length - 5} ${t("more").toLowerCase()}`,
                  ),
              ]),
            solutions.length > 0 &&
              m(".col.s12.m4", [
                m("h6", t("solutions")),
                m(
                  "ul.collection",
                  solutions
                    .slice(0, 5)
                    .map((s) => m("li.collection-item", s.label)),
                ),
                solutions.length > 5 &&
                  m(
                    "p.grey-text",
                    `...${solutions.length - 5} ${t("more").toLowerCase()}`,
                  ),
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
