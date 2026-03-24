import m from "mithril";
import { FlatButton, Collapsible } from "mithril-materialized";
import { FormAttributes, LayoutForm } from "mithril-ui-form";
import {
  Pages,
  type CapabilityModel,
  type ISolution,
  solutionForm,
} from "../models";
import {
  defaultComplianceChecks,
  defaultUserNeeds,
  defaultOperationalNeeds,
  defaultOrganisationalNeeds,
  defaultExpectedImpact,
} from "../models/capability-model/solution";
import { actions, MeiosisComponent, t } from "../services";
import { localizeSolutionData } from "../utils";

export const SolutionsPage: MeiosisComponent = () => {
  const form = solutionForm();
  console.log(form);

  return {
    oninit: ({ attrs }) => actions.setPage(attrs, Pages.SOLUTIONS),
    view: ({ attrs }) => {
      const { catModel = { data: {} } as CapabilityModel } = attrs.state;
      const { data = {} } = catModel;
      const { solutions = [], capabilities = [] } = data;
      if (!data.solutions) data.solutions = solutions;

      const capsWithGaps = capabilities.filter(
        (c) => c.gaps && c.gaps.length > 0,
      );
      const hazardTypes = data.hazardTypes || [];

      return m(".solutions.page", [
        m(".row", [
          m(".col.s12", m("h4", t("solutions_step_title"))),
          m(".col.s12", m("p", t("solutions_step_desc"))),
          capsWithGaps.length > 0 &&
            m(
              ".col.s12",
              m(
                "p.grey-text",
                t("solution_gaps_found", capsWithGaps.length) +
                  ": " +
                  capsWithGaps.map((c) => t(c.id as any)).join(", "),
              ),
            ),
        ]),

        // Add new solution
        m(".row", [
          m(
            ".col.s12.right-align",
            m(FlatButton, {
              iconName: "add",
              iconClass: "right",
              label: t("solution_add"),
              onclick: () => {
                const newSol: ISolution = {
                  id: `sol-${Date.now()}`,
                  label: t("solution_new"),
                  compliance: JSON.parse(
                    JSON.stringify(defaultComplianceChecks),
                  ),
                  userNeeds: JSON.parse(JSON.stringify(defaultUserNeeds)),
                  operationalNeeds: JSON.parse(
                    JSON.stringify(defaultOperationalNeeds),
                  ),
                  organisationalNeeds: JSON.parse(
                    JSON.stringify(defaultOrganisationalNeeds),
                  ),
                  expectedImpact: JSON.parse(
                    JSON.stringify(defaultExpectedImpact),
                  ),
                };
                data.solutions = [...solutions, newSol];
                actions.saveModel(attrs, catModel);
              },
            }),
          ),
        ]),

        // Solution list - use localized data for display
        solutions.length > 0 &&
          m(Collapsible, {
            items: solutions.map((sol) => {
              const localizedSol = localizeSolutionData(sol);
              return {
                header: `${localizedSol.label}${localizedSol.trl ? ` (TRL ${localizedSol.trl})` : ""}`,
                iconName: "lightbulb",
                body: m(".row", [
                  m(".col.s12.right-align", [
                    m(FlatButton, {
                      iconName: "info",
                      label: t("drawer_capabilities"),
                      onclick: () =>
                        actions.openDrawer(attrs, "solution", sol.id),
                    }),
                    m(FlatButton, {
                      iconName: "delete",
                      className: "red-text",
                      onclick: () => {
                        data.solutions = solutions.filter(
                          (s) => s.id !== sol.id,
                        );
                        actions.saveModel(attrs, catModel);
                      },
                    }),
                  ]),
                  // Addressed gaps selector
                  m(".sol-gaps-section", [
                    m(".sol-gaps-label", t("sol_addressed_gaps")),
                    capsWithGaps.length === 0
                      ? m(
                          "p.grey-text",
                          { style: "font-size:13px" },
                          t("sol_no_gaps"),
                        )
                      : capsWithGaps.map((cap) => {
                          const selected = (sol.capabilityIds || []).includes(
                            cap.id,
                          );
                          const capHazards = hazardTypes.filter((h) =>
                            (cap.hazardIds || []).includes(h.id),
                          );
                          return m(
                            ".sol-gap-item",
                            {
                              key: cap.id,
                              class: selected ? "selected" : "",
                              onclick: () => {
                                sol.capabilityIds = selected
                                  ? (sol.capabilityIds || []).filter(
                                      (id) => id !== cap.id,
                                    )
                                  : [...(sol.capabilityIds || []), cap.id];
                                actions.saveModel(attrs, catModel);
                              },
                            },
                            [
                              m("input[type=checkbox]", {
                                checked: selected,
                                onchange: () => {},
                              }),
                              m(".sol-gap-item-body", [
                                m(
                                  "span.sol-gap-cap-name",
                                  (t(cap.id as any) as string) || cap.label,
                                ),
                                capHazards.length > 0 &&
                                  m(
                                    ".sol-gap-hazards",
                                    capHazards.map((h) =>
                                      m(
                                        "span.sol-gap-hazard-tag",
                                        { key: h.id },
                                        (t(h.id as any) as string) || h.label,
                                      ),
                                    ),
                                  ),
                                m(
                                  ".sol-gap-titles",
                                  (cap.gaps || []).map((g, i) =>
                                    m(
                                      "span.sol-gap-title",
                                      { key: i },
                                      g.title || `Gap ${i + 1}`,
                                    ),
                                  ),
                                ),
                              ]),
                            ],
                          );
                        }),
                  ]),
                  m(LayoutForm, {
                    form,
                    obj: sol,
                    context: [localizeSolutionData(data)],
                    i18n: {
                      pickOne: t("pick_one"),
                      pickOneOrMore: t("pick_more"),
                      editRepeat: t("edit"),
                      createRepeat: t("add_term"),
                      deleteItem: t("DELETE"),
                      agree: t("YES"),
                      disagree: t("NO"),
                      cancel: t("CANCEL"),
                      save: t("SAVE_BUTTON", "LABEL"),
                      raw: "Raw",
                      view: "View",
                      locales: ["en", "nl"],
                    },
                    onchange: () => actions.saveModel(attrs, catModel),
                  } as FormAttributes<ISolution>),
                ]),
              };
            }),
          }),

        solutions.length === 0 &&
          m(
            ".row",
            m(
              ".col.s12.center.grey-text",
              { style: "padding: 40px;" },
              m("p", t("solution_empty")),
            ),
          ),
      ]);
    },
  };
};
