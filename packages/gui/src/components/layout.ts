import m from 'mithril';
import { Icon, ThemeToggle, ModalPanel, FlatButton, TextInput, Sidenav, SidenavItem } from 'mithril-materialized';
import logo from '../assets/logo.svg';
import { Pages, Page } from '../models';
import { routingSvc } from '../services/routing-service';
import { actions, APP_TITLE, APP_TITLE_SHORT, MeiosisComponent, t } from '../services';
import { isActivePage } from '../utils';

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
      const { page, searchFilter, searchResults = [], currentSessionId, catModel } = attrs.state;
      const sessionName = currentSessionId && catModel?.data?.title ? catModel.data.title : '';
      const curPage = routingSvc.getList().filter((p) => p.id === page).shift();
      const isFullscreen = curPage?.fullscreen === true;
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
          !isFullscreen && m(
            '.navbar-fixed',
            m(
              'nav',
              m('.nav-wrapper', [
                // Hamburger button — always visible
                m('a.sidenav-trigger', {
                  href: '#',
                  style: 'margin-left: 8px;',
                  onclick: (e: Event) => { e.preventDefault(); _sidenavOpen = !_sidenavOpen; },
                }, m(Icon, { iconName: 'menu' })),

                // Brand logo — compact
                m(
                  'a.brand-logo',
                  {
                    title: APP_TITLE,
                    style: 'left: 56px; color: inherit;',
                    href: routingSvc.href(Pages.LANDING),
                  },
                  [
                    m('img[width=36][height=36][alt=logo]', {
                      src: logo,
                      style: 'margin: 7px 4px; vertical-align: middle;',
                    }),
                    m('span.hide-on-small-only', {
                      style: 'margin-left: 8px; vertical-align: middle; font-size: 1rem;',
                    }, sessionName ? `${APP_TITLE_SHORT} — ${sessionName}` : APP_TITLE_SHORT),
                  ]
                ),

                // Right-side actions
                m('ul.right', [
                  m('li', [
                    m(FlatButton, {
                      iconName: 'search',
                      onclick: () => { searchDialogOpen = true; },
                      tooltip: t('SEARCH_TOOLTIP'),
                    }),
                  ]),
                  m('li', m(ThemeToggle)),
                ]),
              ])
            )
          ),

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
            },
            navPages.map((d: Page) =>
              m(SidenavItem, {
                text: d.step ? `${d.step}. ${d.title}` : d.title,
                icon: typeof d.icon === 'string' ? d.icon : d.icon ? d.icon() : '',
                active: curPage?.id === d.id,
                href: routingSvc.href(d.id),
                onclick: () => { actions.changePage(attrs, d.id); _sidenavOpen = false; },
              })
            )
          ),

          m(
            '.container',
            { style: isFullscreen ? 'padding-top: 0' : '' },
            children,
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
