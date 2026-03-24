import m from 'mithril';
import { ThemeToggle, ModalPanel, FlatButton, TextInput, Sidenav, SidenavItem } from 'mithril-materialized';
import { Pages, Page } from '../models';
import { routingSvc } from '../services/routing-service';
import { actions, APP_TITLE_SHORT, MeiosisComponent, t } from '../services';
import { isActivePage } from '../utils';
import logo from '../assets/logo.svg';
import { ContextDrawer } from './ui/context-drawer';

let _sidenavOpen = false;

export const toggleSidenav = () => {
  _sidenavOpen = !_sidenavOpen;
  m.redraw();
};

export const Layout: MeiosisComponent = () => {
  let searchDialogOpen = false;

  document.addEventListener('keydown', (ev: KeyboardEvent) => {
    if (
      ev.key !== '/' ||
      searchDialogOpen ||
      (ev.target && (ev.target as HTMLTextAreaElement).type === 'textarea') ||
      (ev.target as HTMLInputElement).type === 'text'
    )
      return;
    searchDialogOpen = true;
    m.redraw();
  });

  return {
    view: ({ children, attrs }) => {
      const { page, searchFilter, searchResults = [] } = attrs.state;
      const curPage = routingSvc.getList().filter((p) => p.id === page).shift();
      const isActive = isActivePage(page);

      const navPages = routingSvc
        .getList()
        .filter(
          (d) =>
            d.id !== Pages.LANDING &&
            ((typeof d.visible === 'boolean' ? d.visible : d.visible(attrs.state)) || isActive(d))
        );

      return [
        m('.main', { style: 'overflow-x: hidden' }, [
          // Fixed hamburger — always top-left of the viewport
          m('button.dasf-hamburger', {
            onclick: () => { _sidenavOpen = !_sidenavOpen; },
            title: 'Menu',
          }, m('i.material-icons', 'menu')),

          // Sidenav — primary navigation for all screen sizes
          m(
            Sidenav,
            {
              isOpen: _sidenavOpen,
              onToggle: (open) => { _sidenavOpen = open; },
              position: 'left',
              mode: 'overlay',
              width: 280,
              showBackdrop: true,
              closeOnBackdropClick: true,
              closeOnEscape: true,
              header: {
                text: APP_TITLE_SHORT,
                icon: { type: 'image', content: logo },
                onclick: () => { actions.changePage(attrs, Pages.LANDING); _sidenavOpen = false; },
              },
            },
            [
              ...navPages.map((d: Page) =>
                m(SidenavItem, {
                  text: d.step ? `${d.step}. ${d.title}` : d.title,
                  icon: typeof d.icon === 'string' ? d.icon : d.icon ? d.icon() : '',
                  active: curPage?.id === d.id,
                  href: routingSvc.href(d.id),
                  onclick: () => { actions.changePage(attrs, d.id); _sidenavOpen = false; },
                })
              ),
              m('li.divider', { style: 'margin: 8px 0;' }),
              m('li', { style: 'padding: 8px 16px; display: flex; align-items: center; gap: 8px;' }, [
                m(FlatButton, {
                  iconName: 'search',
                  label: t('SEARCH'),
                  onclick: () => { searchDialogOpen = true; _sidenavOpen = false; },
                }),
              ]),
              m('li', { style: 'padding: 8px 16px; display: flex; align-items: center; gap: 8px;' }, [
                m(ThemeToggle),
              ]),
            ]
          ),

            m(ContextDrawer, { ...attrs }),

          m('.container', children,
            searchDialogOpen &&
              m(ModalPanel, {
                id: 'search-dialog',
                title: t('SEARCH'),
                isOpen: searchDialogOpen,
                onToggle: (open) => { searchDialogOpen = open; },
                description: m('.modal-content.row', [
                  m(TextInput, {
                    id: 'search',
                    label: t('SEARCH'),
                    iconName: 'search',
                    initialValue: searchFilter,
                    autofocus: true,
                    onchange: (v) => { actions.setSearchFilter(attrs, v); },
                  }),
                  searchFilter &&
                    m('div.col.s12', [
                      m('div.clear-button', [
                        m(FlatButton, {
                          iconName: 'close',
                          onclick: () => { actions.setSearchFilter(attrs, ''); searchDialogOpen = false; },
                          style: 'float: right;',
                        }),
                      ]),
                      m('pre', t('HITS', searchResults.length || 0)),
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
                        : m('p', 'No results found'),
                    ]),
                ]),
              })
          ),
        ]),
      ];
    },
  };
};
