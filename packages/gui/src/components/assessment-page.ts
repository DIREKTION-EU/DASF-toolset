import m from "mithril";
import { FormAttributes, LayoutForm, SlimdownView } from "mithril-ui-form";
import { Pages, ICapability, CapabilityModel } from "../models";
import { MeiosisComponent, t, i18n, actions } from "../services";
import { FlatButton } from "mithril-materialized";
import { formatDate, localizeCapabilityModelData, toWord } from "../utils";

export const AssessmentPage: MeiosisComponent = () => {
  return {
    oninit: ({ attrs }) => {
      const id = m.route.param("id") || attrs.state.capabilityId;
      const { capabilities = [] } = attrs.state.catModel?.data ?? {};
      if (id && attrs.state.catModel) {
        const capability =
          capabilities.filter((cap) => cap.id === id).shift() ||
          ({} as ICapability);
        const { id: capabilityId, categoryId, subcategoryId } = capability;
        actions.update(attrs, {
          page: Pages.ASSESSMENT,
          capabilityId,
          categoryId,
          subcategoryId,
        });
      } else if (capabilities.length > 0) {
        const { id: capabilityId, categoryId, subcategoryId } = capabilities[0];
        actions.update(attrs, {
          page: Pages.ASSESSMENT,
          capabilityId,
          categoryId,
          subcategoryId,
        });
      } else {
        actions.setPage(attrs, Pages.ASSESSMENT);
      }
    },
    view: ({ attrs }) => {
      const {
        catModel = { data: {} } as CapabilityModel,
        assessment: af = [],
      } = attrs.state;
      const assessmentForm = af.filter((a) => a);
      const { data = {}, version = 0 } = catModel;
      const { capabilities = [], assessmentScale = [], title = "cat" } = data;
      const capabilityId =
        attrs.state.capabilityId || m.route.param("id").replace(":id", "");
      const cap = (capabilities
        .filter((cap) => cap.id === capabilityId)
        .shift() ||
        (capabilities.length > 0 && capabilities[0]) ||
        {}) as ICapability;

      if (!capabilityId && cap.id) {
        m.route.set(t("assessment_route"), { id: cap.id });
      }

      if (capabilities.length === 0) {
        return m(
          ".assessment.page",
          m(
            ".row",
            m(".col.s12.center.grey-text", { style: "padding: 40px;" }, [
              m("p", t("assess_content")),
              m(
                "a",
                {
                  href: "#",
                  onclick: (e: Event) => {
                    e.preventDefault();
                    actions.changePage(attrs, Pages.OVERVIEW);
                  },
                },
                t("overview"),
              ),
            ]),
          ),
        );
      }

      const { assessmentId } = cap;
      const assessment = assessmentScale
        .filter((a) => a.id === assessmentId)
        .shift();
      const color = assessment ? assessment.color : undefined;

      return m(
        ".assessment.page",
        [
          cap &&
            m(".row", [
              color &&
                m("div.square.right", {
                  style: `background-color: ${color}; border: 4px solid black; width: 40px; height: 40px; border-radius: 20px`,
                }),
              m(FlatButton, {
                title: "Save to Word",
                className: "right",
                iconName: "download",
                onclick: () => {
                  const filename = `${formatDate(Date.now())}_${
                    cap.label || title
                  }_v${version}.docx`;
                  toWord(filename, data, cap);
                },
              }),
              m("h5.col.s12", `${t("cap")} '${cap.label}'`),
              m(
                ".col.s12",
                m(SlimdownView, { md: t("ass_instr"), removeParagraphs: true }),
              ),
            ]),
        ],
        cap && [
          m(
            "form.row",
            { lang: i18n.currentLocale, spellcheck: false },
            m(LayoutForm, {
              // key: capabilityId,
              form: assessmentForm,
              obj: cap,
              context: [localizeCapabilityModelData(data)],
              onchange: () => {
                actions.saveModel(attrs, catModel);
                // console.table(catModel);
              },
              // i18n: i18n,
            } as FormAttributes<Partial<ICapability>>),
          ),
        ],
      );
    },
  };
};
