import m from "mithril";
import { Pages, type CapabilityModel } from "../../models";
import { MeiosisComponent, routingSvc, t } from "../../services";

interface NavItem {
  id: Pages;
  step?: number;
  label?: () => string;
}

const NAV_ITEMS: NavItem[] = [
  { id: Pages.HOME },
  { id: Pages.HAZARDS,   step: 1, label: () => t("HAZARDS",   "TITLE") },
  { id: Pages.OVERVIEW,  step: 2, label: () => t("overview") },
  { id: Pages.SOLUTIONS, step: 3, label: () => t("SOLUTIONS", "TITLE") },
  { id: Pages.ROADMAP,   step: 4, label: () => t("ROADMAP",   "TITLE") },
];

export const PageNav: MeiosisComponent = () => {
  return {
    view: ({ attrs }) => {
      const { page, catModel = {} as CapabilityModel } = attrs.state;
      const { data = {} } = catModel as CapabilityModel;
      const { enabledSteps = [1, 2, 3, 4] } = data as { enabledSteps?: number[] };

      return m("div.dasf-page-nav", { role: "navigation", "aria-label": "Page navigation" },
        NAV_ITEMS.map((item) => {
          const isActive   = page === item.id;
          const isDisabled = item.step !== undefined && !enabledSteps.includes(item.step);
          const title      = item.label ? item.label() : t("HOME", "TITLE");
          const inner      = item.step
            ? m("span.dasf-page-nav__num", `${item.step}`)
            : m("i.material-icons.dasf-page-nav__home-icon", "home");

          if (isDisabled) {
            return m(
              "span.dasf-page-nav__item.dasf-page-nav__item--disabled",
              { key: item.id, title },
              inner,
            );
          }

          return m(
            "a.dasf-page-nav__item",
            {
              key:   item.id,
              href:  routingSvc.href(item.id),
              class: isActive ? "dasf-page-nav__item--active" : "",
              title,
            },
            inner,
          );
        }),
      );
    },
  };
};
