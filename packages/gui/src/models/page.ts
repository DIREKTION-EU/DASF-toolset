import { type ComponentTypes } from "mithril";
import { type State } from "../services";
import { type MeiosisCell } from "meiosis-setup/types";

type IconResolver = string | (() => string);

export enum Pages {
  LANDING = "LANDING",
  LOGIN = "LOGIN",
  HOME = "HOME",
  SETTINGS = "SETTINGS",
  ABOUT = "ABOUT",
  PREPARATION = "PREPARATION",
  ASSESSMENT = "ASSESSMENT",
  OVERVIEW = "OVERVIEW",
  DEVELOPMENT = "DEVELOPMENT",
  EVALUATION = "EVALUATION",
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
}
