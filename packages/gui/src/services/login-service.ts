import m from 'mithril';
import { LandingPage } from '../components';
import { Pages } from '../models/page';
import { actions, type MeiosisComponent } from './meiosis';

const userId = 'userid';
const userRole = 'userrole';

export type UserRole = 'admin' | 'editor' | 'user';

export type User = {
  name: string;
  role: UserRole;
};

export const Auth = {
  username: localStorage.getItem(userId) || '',
  roles: (localStorage.getItem(userRole) || 'user').split(',') as UserRole[],
  isAuthenticated: false,

  isLoggedIn() {
    return (
      typeof Auth.username !== 'undefined' &&
      Auth.username.length > 0 &&
      Auth.roles &&
      Auth.roles.length > 0 &&
      Auth.roles[0].length > 0
    );
  },
  /** Can edit all documents, (un-)publish them, but also change the persons that have access. */
  isAdmin() {
    return Auth.roles.indexOf('admin') >= 0;
  },
  /** Can edit all documents, (un-)publish them. */
  isEditor() {
    return Auth.roles.indexOf('editor') >= 0;
  },
  /** Can edit the document, but also change the persons that have access. */
  isOwner(doc: Partial<{ author: string }>) {
    return Auth.isAdmin() || (Auth.isAuthenticated && doc.author && doc.author.indexOf(Auth.username) >= 0);
  },
  /** Can edit the document, but also change the persons that have access. */
  canCRUD(doc: Partial<{ author: string }>) {
    return Auth.isAuthenticated && (Auth.isAdmin() || Auth.isOwner(doc));
  },
  /** Can edit the document and publish it. */
  canEdit(doc: Partial<{ author: string }>) {
    return Auth.isAuthenticated && (Auth.canCRUD(doc) || Auth.isEditor());
  },
  setUsername(username: string) {
    Auth.username = username;
    localStorage.setItem(userId, username);
    Auth.login();
  },
  setRoles(roles: UserRole[]) {
    Auth.roles = roles;
    localStorage.setItem(userRole, roles.join(','));
    Auth.login();
  },
  setAuthenticated(authN: boolean) {
    Auth.isAuthenticated = authN;
  },
  async login() {
    Auth.isAuthenticated = Auth.isLoggedIn();
  },
  logout() {
    Auth.setAuthenticated(false);
    Auth.setUsername('');
    Auth.setRoles([]);
    m.route.set('/');
  },
};

Auth.login();

// Module exports for Auth helper functions
export const getAuthUser = () => Auth.username;
export const getAuthRoles = () => Auth.roles;
export const isUserAuthenticated = () => Auth.isAuthenticated;
export const checkRole = (role: UserRole) => Auth.roles.includes(role);

export const Login: MeiosisComponent = () => {
  return {
    oninit: ({ attrs }) => actions.setPage(attrs, Pages.LANDING),
    view: ({ attrs }) => {
      const { loggedInUser } = attrs.state;

      if (loggedInUser) {
        return m(LandingPage, { ...attrs });
      }
      return m('pre', JSON.stringify(loggedInUser, null, 2));
    },
  };
};
