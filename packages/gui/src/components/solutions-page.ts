import m from "mithril";
import { FlatButton, Collapsible } from "mithril-materialized";
import { FormAttributes, LayoutForm } from "mithril-ui-form";
import { Pages, type CapabilityModel, type ISolution, solutionForm } from "../models";
import { defaultComplianceChecks, defaultUserNeeds, defaultOperationalNeeds, defaultOrganisationalNeeds, defaultExpectedImpact } from "../models/capability-model/solution";
import { actions, MeiosisComponent, t } from "../services";

export const SolutionsPage: MeiosisComponent = () => {
  return {
    oninit: ({ attrs }) => actions.setPage(attrs, Pages.SOLUTIONS),
    view: ({ attrs }) => {
      const form = solutionForm();
      const { catModel = { data: {} } as CapabilityModel } = attrs.state;
      const { data = {} } = catModel;
      const { solutions = [], capabilities = [] } = data;
      if (!data.solutions) data.solutions = solutions;

      const capsWithGaps = capabilities.filter(c => c.gaps && c.gaps.length > 0);

      return m(".solutions.page", [
        m(".row", [
          m(".col.s12", m("h4", t('solutions_step_title'))),
          m(".col.s12", m("p", t('solutions_step_desc'))),
          capsWithGaps.length > 0 &&
            m(".col.s12", m("p.grey-text",
              t('solution_gaps_found', { n: capsWithGaps.length }) + ': ' + capsWithGaps.map(c => c.label).join(', ')
            )),
        ]),

        // Add new solution
        m(".row", [
          m(".col.s12.right-align", m(FlatButton, {
            iconName: "add",
            iconClass: "right",
            label: t('solution_add'),
            onclick: () => {
              const newSol: ISolution = {
                id: `sol-${Date.now()}`,
                label: t('solution_new'),
                compliance: JSON.parse(JSON.stringify(defaultComplianceChecks)),
                userNeeds: JSON.parse(JSON.stringify(defaultUserNeeds)),
                operationalNeeds: JSON.parse(JSON.stringify(defaultOperationalNeeds)),
                organisationalNeeds: JSON.parse(JSON.stringify(defaultOrganisationalNeeds)),
                expectedImpact: JSON.parse(JSON.stringify(defaultExpectedImpact)),
              };
              data.solutions = [...solutions, newSol];
              actions.saveModel(attrs, catModel);
            },
          })),
        ]),

        // Solution list
        solutions.length > 0 &&
          m(Collapsible, {
            items: solutions.map((sol) => ({
              header: `${sol.label}${sol.trl ? ` (TRL ${sol.trl})` : ''}`,
              iconName: 'lightbulb',
              body: m(".row", [
                m(".col.s12.right-align", m(FlatButton, {
                  iconName: "delete",
                  className: "red-text",
                  onclick: () => {
                    data.solutions = solutions.filter(s => s.id !== sol.id);
                    actions.saveModel(attrs, catModel);
                  },
                })),
                m(LayoutForm, {
                  form,
                  obj: sol,
                  context: [data],
                  onchange: () => actions.saveModel(attrs, catModel),
                } as FormAttributes<ISolution>),
              ]),
            })),
          }),

        solutions.length === 0 &&
          m(".row", m(".col.s12.center.grey-text", { style: 'padding: 40px;' },
            m("p", t('solution_empty'))
          )),
      ]);
    },
  };
};
