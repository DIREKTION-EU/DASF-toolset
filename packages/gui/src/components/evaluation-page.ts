import m from "mithril";
import { Select, Collapsible } from "mithril-materialized";
import { FormAttributes, LayoutForm, render } from "mithril-ui-form";
import { Pages, CapabilityModel } from "../models";
import { MeiosisComponent, t } from "../services";
import { actions } from "../services/meiosis";

export const EvaluationPage: MeiosisComponent = () => {
  return {
    oninit: ({ attrs }) => actions.setPage(attrs, Pages.ROADMAP),
    view: ({ attrs }) => {
      const {
        catModel = { data: {} } as CapabilityModel,
        categoryId,
        subcategoryId: subCategoryId,
        capabilityId,
        projectEvaluation = [],
        evaluation = [],
      } = attrs.state;
      const { data = {} } = catModel;
      const {
        categories = [],
        capabilities = [],
        projectProposals = [],
      } = data;
      if (!data.projectProposals) {
        data.projectProposals = projectProposals;
        actions.saveModel(attrs, catModel);
      }
      const category =
        categoryId && categories.filter((cat) => cat.id === categoryId).shift();
      const caps =
        capabilities &&
        capabilities.filter((cap) => cap.subcategoryId === subCategoryId);
      const cap =
        capabilities &&
        capabilities.filter((cap) => cap.id === capabilityId).shift();

      const projects =
        cap &&
        projectProposals.filter(
          (p) =>
            p.approved &&
            (!p.capabilityIds || p.capabilityIds.includes(cap.id)),
        );

      return m(
        ".evaluation.page",
        [
          m(".row", [
            m(".col.s12", m("h4", "Evaluation")),
            m(
              ".col.s12",
              m(
                "p",
                m.trust(
                  render(
                    `_Evaluate your capability and the associated projects. Start by selecting a capability._`,
                    true,
                  ),
                ),
              ),
            ),
            m(Select, {
              className: "col s4",
              placeholder: t("pick_one"),
              label: "Select category",
              initialValue: categoryId,
              options: categories,
              onchange: (v) =>
                actions.update(attrs, {
                  categoryId: v[0] as string,
                  subcategoryId: undefined,
                  capabilityId: undefined,
                }),
            }),
            category &&
              m(Select, {
                className: "col s4",
                placeholder: t("pick_one"),
                label: "Select subcategory",
                initialValue: subCategoryId,
                options: category && category.subcategories,
                onchange: (v) =>
                  actions.update(attrs, {
                    subcategoryId: v[0] as string,
                    capabilityId: undefined,
                  }),
              }),
            caps &&
              caps.length > 0 &&
              m(Select, {
                className: "col s4",
                placeholder: t("pick_one"),
                label: "Select capability",
                initialValue: capabilityId,
                options: caps,
                onchange: (v) =>
                  actions.update(attrs, { capabilityId: v[0] as string }),
              }),
          ]),
          cap && m(".row", m("h5.col.s12", `Capability '${cap.label}'`)),
        ],
        cap &&
          m(
            ".row",
            m(LayoutForm, {
              form: evaluation,
              obj: cap,
              context: [data],
              onchange: () => {
                actions.saveModel(attrs, catModel);
              },
            } as FormAttributes<Partial<CapabilityModel>>),
          ),
        projects &&
          projects.length > 0 &&
          m(Collapsible, {
            items: projects.map((p) => ({
              header: p.label,
              body: m(
                ".row",
                m(LayoutForm, {
                  form: projectEvaluation,
                  obj: p,
                  context: [data],
                  onchange: () => {
                    actions.saveModel(attrs, catModel);
                  },
                } as FormAttributes),
              ),
              iconName: p.approved ? "engineering" : "lightbulb",
            })),
          }),
      );
    },
  };
};
