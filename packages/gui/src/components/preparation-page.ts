import m from "mithril";
import { TabItem, Tabs } from "mithril-materialized";
import { LayoutForm, UIForm, render, FormAttributes } from "mithril-ui-form";
import { Pages, ICapabilityDataModel, CapabilityModel } from "../models";
import { actions, MeiosisComponent, t } from "../services";

export const PreparationPage: MeiosisComponent = () => {
  return {
    oninit: ({ attrs }) => actions.setPage(attrs, Pages.PREPARATION),
    view: ({ attrs }) => {
      const {
        preparations = [] as UIForm<ICapabilityDataModel>,
        catModel = {
          preparations: [],
          data: {},
        } as CapabilityModel,
      } = attrs.state;
      const { data = {} } = catModel;
      const prepare = preparations.filter(
        (i) => i.type === "section",
      ) as UIForm<ICapabilityDataModel>;

      const tabs = prepare.map(
        (s, i) =>
          ({
            id: s.id,
            title: `${i + 1}. ${s.label}`,
            vnode: m(LayoutForm, {
              form: preparations,
              obj: data,
              section: s.id,
              onchange: () => {
                actions.saveModel(attrs, catModel);
              },
            } as FormAttributes<ICapabilityDataModel>),
          }) as TabItem,
      );
      return m(".row", { style: "height: 90vh" }, [
        m(".col.s12", m("h4", t("preparation"))),
        m(".col.s12", m("p", m.trust(render(t("prep_content"), true)))),
        m(Tabs, { tabs, tabWidth: "fill" }),
      ]);
    },
  };
};
