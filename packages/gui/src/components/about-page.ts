import m from 'mithril';
import { Select } from 'mithril-materialized';
import { Pages } from '../models/index';
import { type MeiosisComponent, type UserRole, actions, t } from '../services/index';

export const AboutPage: MeiosisComponent = () => {
  return {
    oninit: ({ attrs }) => actions.setPage(attrs, Pages.ABOUT),
    view: ({ attrs }) => {
      const { role } = attrs.state;
      const roleIcon = role === 'user' ? 'person' : role === 'editor' ? 'edit' : 'manage_accounts';

      return m('#about-page.row.about.page', [
        m(Select<UserRole>, {
          checkedId: role,
          iconName: roleIcon,
          options: [
            { id: 'user', label: t('USER') },
            { id: 'editor', label: t('EDITOR') },
            { id: 'admin', label: t('ADMIN') },
          ],
          onchange: (role) => {
            actions.setRole(attrs, role[0]);
          },
        }),
        m('.col.s12.m8.offset-m2.l6.offset-l6', [
          m('h2.primary-text', t('ABOUT', 'PAGE')),
          m('p', t('ABOUT', 'INTRO')),
          m('.divider'),
          m('h4', t('ABOUT', 'SECTION1_TITLE')),
          m('p', t('ABOUT', 'SECTION1')),
          m('.divider'),
          m('h4', t('ABOUT', 'SECTION2_TITLE')),
          m('p', t('ABOUT', 'SECTION2')),
          m('.divider'),
          m('h4', t('ABOUT', 'SECTION3_TITLE')),
          m('p', t('ABOUT', 'SECTION3')),
        ]),
      ]);
    },
  };
};
