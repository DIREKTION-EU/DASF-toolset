import m, { type RouteDefs } from "mithril";
import { Pages, type Page } from "../models";
import { Layout } from "../components/layout";
import {
  AboutPage,
  HomePage,
  LandingPage,
  NotFoundPage,
  SettingsPage,
} from "../components";
import { t } from "./translations";
import { cells } from "./meiosis";

class RoutingService {
  private pages!: ReadonlyArray<Page>;

  constructor() {}

  public init() {
    const routes: Page[] = [
      {
        id: Pages.LANDING,
        title: t("LANDING", "TITLE"),
        route: t("LANDING", "ROUTE"),
        visible: false,
        default: true,
        hasSidebar: true,
        component: LandingPage,
      },
      {
        id: Pages.HOME,
        icon: "home",
        title: t("HOME", "TITLE"),
        route: t("HOME", "ROUTE"),
        visible: true,
        hasSidebar: true,
        component: HomePage,
      },
      {
        id: Pages.ABOUT,
        icon: "info",
        title: t("ABOUT", "TITLE"),
        route: t("ABOUT", "ROUTE"),
        visible: true,
        component: AboutPage,
      },
      {
        id: Pages.SETTINGS,
        icon: "settings",
        iconClass: "blue-text",
        title: t("SETTINGS", "TITLE"),
        route: t("SETTINGS", "ROUTE"),
        visible: ({ role }) => role === "admin",
        component: SettingsPage,
      },
      {
        id: Pages.NOT_FOUND,
        title: t("PAGE_NOT_FOUND"),
        route: "/404",
        visible: false,
        component: NotFoundPage,
      },
    ];
    this.setList(routes);
  }

  public getList() {
    return this.pages;
  }

  public setList(list: Page[]) {
    this.pages = Object.freeze(list);
  }

  public get defaultRoute() {
    const dashboard = this.pages.filter((d) => d.default).shift();
    return dashboard ? dashboard.route : this.pages[0].route;
  }

  public route(
    page: Pages,
    query?: { [key: string]: string | number | undefined },
  ) {
    const dashboard = this.pages.filter((d) => d.id === page).shift();
    return dashboard
      ? "#!" + dashboard.route + (query ? "?" + m.buildQueryString(query) : "")
      : this.defaultRoute;
  }

  public href(page: Pages, params = "" as string | number) {
    const dashboard = this.pages.filter((d) => d.id === page).shift();
    return dashboard
      ? `#!${dashboard.route.replace(/:\w*/, "")}${params}`
      : this.defaultRoute;
  }

  public switchTo(
    page: Pages,
    params?: { [key: string]: string | number | undefined },
    query?: { [key: string]: string | number | undefined },
  ) {
    const dashboard = this.pages.filter((d) => d.id === page).shift();
    if (dashboard) {
      const url =
        dashboard.route + (query ? "?" + m.buildQueryString(query) : "");
      m.route.set(url, params);
    }
  }

  public routingTable() {
    return this.pages.reduce((p, c) => {
      p[c.route] =
        c.hasNavBar === false
          ? {
              render: () => {
                return m(c.component, { ...cells() });
              },
            }
          : {
              render: () => {
                const cell = cells();
                return m(Layout, { ...cell }, m(c.component, { ...cell }));
              },
            };
      return p;
    }, {} as RouteDefs);
  }
}

export const routingSvc: RoutingService = new RoutingService();
