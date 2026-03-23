import m from 'mithril';
import { type MeiosisComponent } from '../services';

export const NotFoundPage: MeiosisComponent = () => {
  return {
    view: () => {
      return m('#not-found-page.row.not-found.page', [
        m('.col.s12.center', [
          m('h1', '404'),
          m('h2', 'Page Not Found'),
          m('p', 'The page you are looking for does not exist.'),
          m(
            'a.btn',
            {
              href: '#!/home',
            },
            'Go Home'
          ),
        ]),
      ]);
    },
  };
};
