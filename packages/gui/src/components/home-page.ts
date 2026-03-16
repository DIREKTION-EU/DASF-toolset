import m from 'mithril';
import { Pages } from '../models';
import { type MeiosisComponent, t } from '../services';
import { actions } from '../services/meiosis';

export const HomePage: MeiosisComponent = () => {
  return {
    oninit: ({ attrs }) => actions.setPage(attrs, Pages.HOME),
    view: () => {
      return m('#home-page.row.home.page', [
        m('.col.s12.m8.offset-m2.l6.offset-l6', [
          m('h2.primary-text', t('HOME', 'PAGE')),
          m('p', t('HOME', 'INTRO')),
          m('.divider'),
          m('h4', t('HOME', 'SECTION1_TITLE')),
          m('p', t('HOME', 'SECTION1')),
          m('.divider'),
          m('h4', t('HOME', 'SECTION2_TITLE')),
          m('p', t('HOME', 'SECTION2')),
          m('.divider'),
          m('h4', t('HOME', 'SECTION3_TITLE')),
          m('p', t('HOME', 'SECTION3')),
        ]),
      ]);
    },
  };
};
