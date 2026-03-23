import m from "mithril";
import { TabItem, Tabs } from "mithril-materialized";
import { FormAttributes, LayoutForm, UIForm } from "mithril-ui-form";
import { Pages } from "../models";
import {
  ICapabilityDataModel,
  CapabilityModel,
} from "../models/capability-model/capability-model";
import { actions, MeiosisComponent } from "../services";

export const SettingsPage: MeiosisComponent = () => ({
  oninit: ({ attrs }) => actions.setPage(attrs, Pages.SETTINGS),
  view: ({ attrs }) => {
    const {
      settings: form = [],
      catModel = {
        form: [] as UIForm,
        settings: [] as UIForm,
        data: {},
      } as CapabilityModel,
    } = attrs.state;
    const { data = {} } = catModel;
    const sections = form.filter((i) => i.type === "section");
    const tabs = sections.map(
      (s) =>
        ({
          id: s.id,
          title: s.label,
          vnode: m(LayoutForm, {
            form,
            obj: data,
            section: s.id,
            context: [data],
            onchange: () => {
              actions.saveModel(attrs, catModel);
            },
          } as FormAttributes<ICapabilityDataModel>),
        }) as TabItem,
    );
    return m(".settings.page", m(".row", m(Tabs, { tabs, tabWidth: "fill" })));
  },
});
