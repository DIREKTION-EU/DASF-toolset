import m from 'mithril';
import { Pages } from '../models/index';
import { actions, type MeiosisComponent, t } from '../services/index';

export const SettingsPage: MeiosisComponent = () => {
  return {
    oninit: ({ attrs }) => {
      actions.setPage(attrs, Pages.SETTINGS);
    },
    view: () => {
      return m('#settings-page.settings.page', [
        m('.col.s12.m8.offset-m2.l6.offset-l6', [
          m('h2.primary-text', t('SETTINGS', 'PAGE')),
          m('p', t('SETTINGS', 'INTRO')),
          m('.divider'),
          m('h4', t('SETTINGS', 'SECTION1_TITLE')),
          m('p', t('SETTINGS', 'SECTION1')),
          m('.divider'),
          m('h4', t('SETTINGS', 'SECTION2_TITLE')),
          m('p', t('SETTINGS', 'SECTION2')),
          m('.divider'),
          m('h4', t('SETTINGS', 'SECTION3_TITLE')),
          m('p', t('SETTINGS', 'SECTION3')),
        ]),
      ]);
    },
  };
};
