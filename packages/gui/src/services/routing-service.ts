import m, { type RouteDefs } from "mithril";
import { Pages, type Page } from "../models/page";
import { Layout } from "../components/layout";
import {
  AboutPage,
  AssessmentPage,
  HomePage,
  LandingPage,
  NotFoundPage,
  OverviewPage,
  PreparationPage,
  SettingsPage,
  TaxonomyPage,
  HazardsPage,
  SolutionsPage,
  RoadmapPage,
} from "../components";
import { t } from "./translations";
import { cells } from "./meiosis";

const hasSession = (s: { currentSessionId?: string }) => !!s.currentSessionId;
const hasSessionAndStep =
  (step: number) =>
  (s: {
    currentSessionId?: string;
    catModel?: { data?: { enabledSteps?: number[] } };
  }) =>
    !!s.currentSessionId &&
    (!s.catModel?.data?.enabledSteps ||
      s.catModel.data.enabledSteps.includes(step));

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
        hasNavBar: false,
        component: LandingPage,
      },
      {
        id: Pages.HOME,
        icon: "dashboard",
        title: t("HOME", "TITLE"),
        route: "/dashboard",
        visible: hasSession,
        component: HomePage,
      },
      {
        id: Pages.HAZARDS,
        title: t("HAZARDS", "TITLE"),
        icon: "warning",
        route: t("HAZARDS", "ROUTE"),
        visible: hasSessionAndStep(1),
        component: HazardsPage,
        step: 1,
      },
      {
        id: Pages.OVERVIEW,
        title: t("overview"),
        icon: "apps",
        route: t("overview_route"),
        visible: hasSessionAndStep(2),
        component: OverviewPage,
        step: 2,
        fullscreen: true,
      },
      {
        id: Pages.ASSESSMENT,
        title: t("assessment"),
        icon: "assessment",
        route: t("assessment_route"),
        visible: false, //hasSessionAndStep(2),
        component: AssessmentPage,
        step: 2,
      },
      {
        id: Pages.SOLUTIONS,
        title: t("SOLUTIONS", "TITLE"),
        icon: "lightbulb",
        route: t("SOLUTIONS", "ROUTE"),
        visible: hasSessionAndStep(3),
        component: SolutionsPage,
        step: 3,
      },
      {
        id: Pages.ROADMAP,
        title: t("ROADMAP", "TITLE"),
        icon: "timeline",
        route: t("ROADMAP", "ROUTE"),
        visible: hasSessionAndStep(4),
        component: RoadmapPage,
        step: 4,
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
        id: Pages.TAXONOMY,
        title: t("taxonomy"),
        icon: "book",
        route: t("taxonomy_route"),
        visible: hasSession,
        component: TaxonomyPage,
      },
      {
        id: Pages.PREPARATION,
        title: t("preparation"),
        icon: "video_settings",
        iconClass: "blue-text",
        route: t("preparation_route"),
        visible: (s) =>
          hasSession(s) && s.curUser !== undefined && s.curUser !== "user",
        component: PreparationPage,
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
