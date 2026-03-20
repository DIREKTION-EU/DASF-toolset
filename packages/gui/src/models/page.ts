import { type ComponentTypes } from "mithril";
import { type MeiosisCell } from "meiosis-setup/types";
import { State } from "src/services/meiosis";

type IconResolver = string | (() => string);

export enum Pages {
  LANDING = "LANDING",
  HOME = "HOME",
  HAZARDS = "HAZARDS",
  OVERVIEW = "OVERVIEW",
  ASSESSMENT = "ASSESSMENT",
  SOLUTIONS = "SOLUTIONS",
  ROADMAP = "ROADMAP",
  PREPARATION = "PREPARATION",
  SETTINGS = "SETTINGS",
  ABOUT = "ABOUT",
  TAXONOMY = "TAXONOMY",
  NOT_FOUND = "NOT_FOUND",
}

export type VisibilityResolver = (s: State) => boolean;

export interface Page {
  id: Pages;
  default?: boolean;
  hasNavBar?: boolean;
  title: string;
  icon?: IconResolver;
  iconClass?: string;
  route: string;
  visible: boolean | VisibilityResolver;
  component: ComponentTypes<MeiosisCell<State> & { [key: string]: any }>;
  sidebar?: ComponentTypes<MeiosisCell<State> & { [key: string]: any }>;
  hasSidebar?: boolean;
  /** DASF step number (1-4) for step indicator */
  step?: number;
  /**
   * When true, the page is wrapped in Layout (sidenav available) but
   * the top navbar is hidden. The page renders its own compact header.
   */
  fullscreen?: boolean;
}
