import m from 'mithril';
import { Icon, TextInput } from 'mithril-materialized';
import background from '../assets/background.jpg';
import { type MeiosisComponent, t } from '../services';
import { Pages } from '../models';
import { actions } from '../services/meiosis';

export const LandingPage: MeiosisComponent = () => {
  return {
    oninit: ({ attrs }) => {
      actions.setPage(attrs, Pages.LANDING);
    },
    view: ({ attrs }) => {
      const { searchFilter, searchResults } = attrs.state;

      return [
        m('div', { style: 'position: relative;' }, [
          m(
            '.overlay.center',
            {
              style: 'position: absolute; width: 100%',
            },
            [m('h3.primary-text', 'Introduction')]
          ),
          m('img.responsive-img.center', { src: background }),
          m(
            '.section',
            m('.row.container.center', [
              m('.row', [
                m(
                  '.col.s12.m4',
                  m('.intro-block', [
                    m('.center', m(Icon, { iconName: 'handshake' })),
                    m('h5.center', 'TODO'),
                    m('p.light', 'TODO'),
                  ])
                ),
                m(
                  '.col.s12.m4',
                  m('.intro-block', [
                    m('.center', m(Icon, { iconName: 'front_hand' })),
                    m('h5.center', 'TODO'),
                    m('p.light', `TODO`),
                  ])
                ),
                m(
                  '.col.s12.m4',
                  m('.intro-block', [
                    m('.center', m(Icon, { iconName: 'map' })),
                    m('h5.center', 'TODO'),
                    m('p.light', 'TODO'),
                  ])
                ),
              ]),
            ])
          ),
          m('.container', [
            m('.row', [
              m('.col.s12', [
                m(TextInput, {
                  id: 'landing-search',
                  iconName: 'search',
                  label: t('SEARCH'),
                  initialValue: searchFilter,
                  onchange: (value) => {
                    actions.setSearchFilter(attrs, value);
                  },
                  actions: [
                    {
                      iconName: 'close',
                      onclick: () => {
                        actions.setSearchFilter(attrs, '');
                      },
                      tooltip: t('CLEAR_SEARCH'),
                    },
                  ],
                }),
              ]),
            ]),
            searchFilter &&
              m('.row', [
                m('.col.s12', [
                  m('p', t('HITS', searchResults.length || 0)),
                  searchResults.length > 0
                    ? m(
                        'ul.collection',
                        searchResults.map((result: any) =>
                          m('li.collection-item', [
                            m('strong', result.title || result.name || 'Unknown'),
                            result.description && m('p.description', result.description),
                            result.content && m('p.content', result.content),
                            result._matchedFields &&
                              m('small.matched', 'Matched in: ' + result._matchedFields.join(', ')),
                          ])
                        )
                      )
                    : m('p', t('NO_RESULTS')),
                ]),
              ]),
          ]),
        ]),
      ];
    },
  };
};
