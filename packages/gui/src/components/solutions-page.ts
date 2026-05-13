import { getFormI18nConfig } from "../services/translations";
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
import { PageNav } from "./ui";
import {
  localizeSolutionData,
  translateLabelOrFallback,
  translatedOrFallback,
} from "../utils";

/** Translate item labels in-place using their IDs. Safe to call at render time since labels are readonly in the form. */
const translateItemLabels = (items?: Array<{ id?: string; label: string }>) => {
  items?.forEach((item) => {
    item.label = translateLabelOrFallback(item);
  });
};

export const SolutionsPage: MeiosisComponent = () => {
  const form = solutionForm();
  const hiddenQuestionFieldIds = new Set([
    "compliance-section",
    "compliance",
    "user-needs-section",
    "userNeeds",
    "operational-needs-section",
    "operationalNeeds",
    "organisational-needs-section",
    "organisationalNeeds",
    "expected-impact-section",
    "expectedImpact",
  ]);
  const baseForm = form.filter(
    (field) => !hiddenQuestionFieldIds.has(String(field.id || "")),
  );
  const questionForms = {
    userNeeds: form.find((field) => field.id === "userNeeds"),
    operationalNeeds: form.find((field) => field.id === "operationalNeeds"),
    organisationalNeeds: form.find(
      (field) => field.id === "organisationalNeeds",
    ),
    expectedImpact: form.find((field) => field.id === "expectedImpact"),
    compliance: form.find((field) => field.id === "compliance"),
  };

  return {
    oninit: ({ attrs }) => actions.setPage(attrs, Pages.SOLUTIONS),
    view: ({ attrs }) => {
      const { catModel = { data: {} } as CapabilityModel } = attrs.state;
      const { data = {} } = catModel;
      const { solutions = [], capabilities = [] } = data;
      if (!data.solutions) data.solutions = solutions;

      const hazardTypes = data.hazardTypes || [];

      return m(".solutions.page", [
        m(PageNav, { ...attrs }),
        m(".row", [
          m(".col.s12", m("h4", t("solutions_step_title"))),
          m(".col.s12", m("p", t("solutions_step_desc"))),
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
              translateItemLabels(sol.compliance);
              translateItemLabels(sol.userNeeds);
              translateItemLabels(sol.operationalNeeds);
              translateItemLabels(sol.organisationalNeeds);
              translateItemLabels(sol.expectedImpact);
              return {
                header: `${sol.label}${sol.trl ? ` (TRL ${sol.trl})` : ""}`,
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
                  // Addressed capabilities selector
                  m(".sol-gaps-section", [
                    m(".sol-gaps-label", t("sol_addressed_gaps")),
                    capabilities.length === 0
                      ? m(
                          "p.grey-text",
                          { style: "font-size:13px" },
                          t("sol_no_gaps"),
                        )
                      : capabilities.map((cap) => {
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
                                  translatedOrFallback(
                                    t(cap.id as any),
                                    cap.id,
                                    cap.label,
                                  ),
                                ),
                                capHazards.length > 0 &&
                                  m(
                                    ".sol-gap-hazards",
                                    capHazards.map((h) =>
                                      m(
                                        "span.sol-gap-hazard-tag",
                                        { key: h.id },
                                        translatedOrFallback(
                                          t(h.id as any),
                                          h.id,
                                          h.label,
                                        ),
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
                    form: baseForm,
                    obj: sol,
                    context: [localizeSolutionData(data)],
                    i18n: getFormI18nConfig(),
                    onchange: () => actions.saveModel(attrs, catModel),
                  } as FormAttributes<ISolution>),
                  m(Collapsible, {
                    items: [
                      {
                        title: t("sol_user_needs_title"),
                        form: questionForms.userNeeds,
                      },
                      {
                        title: t("sol_operational_needs_title"),
                        form: questionForms.operationalNeeds,
                      },
                      {
                        title: t("sol_organisational_needs_title"),
                        form: questionForms.organisationalNeeds,
                      },
                      {
                        title: t("sol_expected_impact_title"),
                        form: questionForms.expectedImpact,
                      },
                      {
                        title: t("sol_compliance_title"),
                        form: questionForms.compliance,
                      },
                    ]
                      .filter((item) => !!item.form)
                      .map((item) => ({
                        header: item.title,
                        iconName: "checklist",
                        body: m(
                          ".row",
                          m(LayoutForm, {
                            form: [item.form!],
                            obj: sol,
                            context: [localizeSolutionData(data)],
                            i18n: getFormI18nConfig(),
                            onchange: () => actions.saveModel(attrs, catModel),
                          } as FormAttributes<ISolution>),
                        ),
                      })),
                  }),
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
