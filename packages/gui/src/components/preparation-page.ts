import { getFormI18nConfig } from "../services/translations";
import m from "mithril";
import { TabItem, Tabs } from "mithril-materialized";
import { LayoutForm, UIForm, render, FormAttributes } from "mithril-ui-form";
import { Pages, ICapabilityDataModel, CapabilityModel } from "../models";
import { defaultHazardTypes } from "../models/capability-model/hazard";
import { actions, MeiosisComponent, t } from "../services";
import { translatedOrFallback } from "../utils";

const ALL_STEPS = [
  { step: 0, titleKey: "step0_title" as const },
  { step: 1, titleKey: "step1_title" as const },
  { step: 2, titleKey: "step2_title" as const },
  { step: 3, titleKey: "step3_title" as const },
];

export const PreparationPage: MeiosisComponent = () => {
  return {
    oninit: ({ attrs }) => {
      actions.setPage(attrs, Pages.PREPARATION);
      const { catModel = {} as CapabilityModel } = attrs.state;
      const { data = {} } = catModel;
      if (!data.hazardTypes || data.hazardTypes.length === 0) {
        data.hazardTypes = JSON.parse(JSON.stringify(defaultHazardTypes));
        actions.saveModel(attrs, catModel);
      }
    },
    view: ({ attrs }) => {
      const {
        preparations = [] as UIForm<ICapabilityDataModel>,
        catModel = {
          preparations: [],
          data: {},
        } as CapabilityModel,
      } = attrs.state;
      const { data = {} } = catModel;

      // Refresh hazard labels from the current locale so each user sees their own language.
      // Only overwrites if a translation key exists (custom hazards without a known ID keep their stored label).
      (data.hazardTypes ?? []).forEach((h) => {
        h.label = translatedOrFallback(t(h.id as any), h.id, h.label);
      });

      const enabledSteps = data.enabledSteps || [0, 1, 2, 3];
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
              // context: [data],
              section: s.id,
              i18n: getFormI18nConfig(),
              onchange: () => {
                data.selectedHazardIds = (data.hazardTypes ?? [])
                  .filter((h) => h.selected)
                  .map((h) => h.id);
                actions.saveModel(attrs, catModel);
              },
            } as FormAttributes<ICapabilityDataModel>),
          }) as TabItem,
      );
      return m(".row", { style: "height: 90vh" }, [
        m(".col.s12", m("h4", t("preparation"))),
        m(".col.s12", m("p", m.trust(render(t("prep_content"), true)))),
        m(
          ".col.s12",
          m(
            ".card.dasf-steps-toggle",
            m(".card-content", [
              m("span.card-title", t("enabled_steps")),
              m(
                ".row",
                ALL_STEPS.map(({ step, titleKey }) =>
                  m(".col.s6.m3", { key: step }, [
                    m("label", [
                      m("input[type=checkbox]", {
                        checked: enabledSteps.includes(step),
                        onchange: (e: Event) => {
                          const checked = (e.target as HTMLInputElement)
                            .checked;
                          data.enabledSteps = checked
                            ? [...enabledSteps, step].sort()
                            : enabledSteps.filter((s) => s !== step);
                          actions.saveModel(attrs, catModel);
                        },
                      }),
                      m("span", `${step}. ${t(titleKey)}`),
                    ]),
                  ]),
                ),
              ),
            ]),
          ),
        ),
        m(Tabs, { tabs, tabWidth: "fill" }),
      ]);
    },
  };
};
