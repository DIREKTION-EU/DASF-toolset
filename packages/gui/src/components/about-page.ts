import m from "mithril";
import { render } from "mithril-ui-form";
import { CapabilityModel, Pages, UserType } from "../models";
import { actions, MeiosisComponent, t } from "../services";
import tnoLogo from "../assets/tno_txt.svg";
import { Select } from "mithril-materialized";

export const Attribution: MeiosisComponent = () => {
  return {
    view: ({
      attrs: {
        state: { catModel = {} as CapabilityModel },
      },
    }) => {
      const { attributionLogo, attributionText, logo } = catModel.data || {};

      return (
        (attributionLogo || attributionText) &&
        m(
          ".footer.flex-container",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
            },
          },
          [
            m(
              ".logo",
              { style: "max-width: 100%" },
              attributionLogo &&
                m("img[height=50][title=Attribution logo]", {
                  src: attributionLogo,
                }),
            ),
            m(
              ".flex-item",
              { style: { flex: "1", margin: "0 20px", fontSize: "10pt" } },
              attributionText &&
                m("span", m.trust(render(attributionText, true))),
            ),
            m(
              ".logo.right-align",
              { style: "max-width: 100%" },
              m("img[height=50][title=Owner]", { src: logo || tnoLogo }),
            ),
          ],
        )
      );
    },
  };
};

export const AboutPage: MeiosisComponent = () => ({
  oninit: ({ attrs }) => actions.setPage(attrs, Pages.ABOUT),
  view: ({ attrs }) => {
    const { curUser } = attrs.state;
    return [
      m(".row", [
        m(Select<UserType>, {
          label: t("select_user"),
          initialValue: curUser,
          options: [
            { id: "user", label: t("user") },
            { id: "moderator", label: t("moderator") },
            { id: "admin", label: t("admin") },
          ],
          onchange: (v) => v && actions.saveCurUser(attrs, v[0]),
          className: "col offset-s6 s6 offset-m9 m3",
        }),
        m(".col.s12.markdown", m.trust(render(t("about_markdown")))),
      ]),
      m(Attribution, { ...attrs }),
    ];
  },
});
