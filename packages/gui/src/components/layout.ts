import m from 'mithril';
import { Icon, ThemeToggle, ModalPanel, FlatButton, TextInput, Sidenav, SidenavItem } from 'mithril-materialized';
import logo from '../assets/logo.svg';
import { Pages, Page } from '../models';
import { routingSvc } from '../services/routing-service';
import { actions, APP_TITLE, APP_TITLE_SHORT, MeiosisComponent, t } from '../services';
import { isActivePage, isSmallPage } from '../utils';

export const Layout: MeiosisComponent = () => {
  let searchDialogOpen = false;
  let sidenavOpen = false;
  const style = 'font-size: 2.2rem; width: 4rem;';

  document.addEventListener('keydown', (ev: KeyboardEvent) => {
    console.log({ searchDialogOpen });
    if (
      ev.key !== '/' ||
      searchDialogOpen ||
      (ev.target && (ev.target as HTMLTextAreaElement).type === 'textarea') ||
      (ev.target as HTMLInputElement).type === 'text'
    )
      return;
    // ev.preventDefault(); // Prevent the slash key from being inputted into input fields
    searchDialogOpen = true;
    m.redraw();
  });

  return {
    view: ({ children, attrs }) => {
      const { page, searchFilter, searchResults } = attrs.state;
      const curPage = routingSvc
        .getList()
        .filter((p) => p.id === page)
        .shift();
      const isActive = isActivePage(page);

      return [
        m('.main', { style: 'overflow-x: hidden' }, [
          m(
            '.navbar-fixed',
            m(
              'nav',
              m('.nav-wrapper', [
                m(
                  'a.brand-logo.hide-on-med-and-down',
                  {
                    title: APP_TITLE,
                    style: 'margin-left: 20px; color: black; height: 50%',
                    href: routingSvc.href(Pages.LANDING),
                  },
                  [
                    m('img[width=50][height=50][alt=logo]', {
                      src: logo,
                      style: 'margin: 6px -6px;',
                    }),
                    m('span', { style: 'margin-left: 20px; vertical-align: top;' }, APP_TITLE),
                  ]
                ),
                m(
                  'a.brand-logo.show-on-small',
                  {
                    title: APP_TITLE_SHORT,
                    style: 'margin-left: 20px; height: 50%',
                    href: routingSvc.href(Pages.LANDING),
                  },
                  [
                    m('img[width=50][height=50][alt=logo]', {
                      src: logo,
                      style: 'margin: 6px -6px;',
                    }),
                    m('span', { style: 'margin-left: 20px; vertical-align: top;' }, APP_TITLE_SHORT),
                  ]
                ),

                m('ul.right.hide-on-med-and-down', [
                  m('li.tooltip.cursor-pointer', [
                    m(FlatButton, {
                      iconName: 'search',
                      onclick: () => {
                        searchDialogOpen = true;
                      },
                      tooltip: t('SEARCH_TOOLTIP'),
                    }),
                  ]),
                  ...routingSvc
                    .getList()
                    .filter(
                      (d) =>
                        d.id !== Pages.LANDING &&
                        ((typeof d.visible === 'boolean' ? d.visible : d.visible(attrs.state)) || isActive(d))
                    )
                    .map((d: Page) =>
                      m('li', { style: 'text-align:center', class: isActive(d) }, [
                        m(
                          'a.primary-text',
                          {
                            title: d.title,
                            href: routingSvc.href(d.id),
                            onclick: () => actions.changePage(attrs, d.id),
                          },
                          m(Icon, {
                            className: d.iconClass ? ` ${d.iconClass}` : '',
                            style,
                            iconName: typeof d.icon === 'string' ? d.icon : d.icon ? d.icon() : '',
                          })
                        ),
                      ])
                    ),
                  m('li', m(ThemeToggle)),
                ]),
              ])
            )
          ),
          (isSmallPage() || (curPage && curPage.hasSidebar)) && [
            m(FlatButton, {
              iconName: 'menu',
              onclick: () => (sidenavOpen = !sidenavOpen),
              className: 'left',
            }),
          ],
          m(
            Sidenav,
            {
              isOpen: sidenavOpen,
              onToggle: (open) => {
                sidenavOpen = open;
              },
              position: 'left', // 'left' | 'right'
              mode: 'overlay', // 'overlay' | 'push'
              width: 300,
              showBackdrop: true,
              closeOnBackdropClick: true,
              closeOnEscape: true,
            },
            routingSvc
              .getList()
              .filter(
                (d) =>
                  d.id !== Pages.LANDING &&
                  ((typeof d.visible === 'boolean' ? d.visible : d.visible(attrs.state)) || isActive(d))
              )
              .map(
                (d: Page) =>
                  m(SidenavItem, {
                    text: d.title,
                    icon: typeof d.icon === 'string' ? d.icon : d.icon ? d.icon() : '',
                    active: curPage?.id === d.id,
                  })
                // { style: 'text-align:center', class: isActive(d) }, [
                // m(
                //   'a.primary-text',
                //   {
                //     title: d.title,
                //     href: routingSvc.href(d.id),
                //     onclick: () => actions.changePage(attrs, d.id),
                //   },
                //   m(Icon, {
                //     className: d.iconClass ? ` ${d.iconClass}` : '',
                //     style,
                //     iconName: typeof d.icon === 'string' ? d.icon : d.icon ? d.icon() : '',
                //   })
                // ),
              )
          ),
          m(
            '.container',
            children,
            searchDialogOpen &&
              m(ModalPanel, {
                id: 'search-dialog',
                title: t('SEARCH'),
                isOpen: searchDialogOpen,
                onToggle: (open) => {
                  searchDialogOpen = open;
                },
                description: m('.modal-content.row', [
                  m(TextInput, {
                    id: 'search',
                    label: t('SEARCH'),
                    iconName: 'search',
                    initialValue: searchFilter,
                    autofocus: true,
                    onchange: (v) => {
                      actions.setSearchFilter(attrs, v);
                    },
                  }),
                  searchFilter &&
                    m('div.col.s12', [
                      m('div.clear-button', [
                        m(FlatButton, {
                          iconName: 'close',
                          onclick: () => {
                            actions.setSearchFilter(attrs, '');
                            searchDialogOpen = false;
                          },
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
                                result.description &&
                                  m('p.description', result.description),
                                result.content &&
                                  m('p.content', result.content),
                                result._matchedFields &&
                                  m(
                                    'small.matched',
                                    'Matched in: ' + result._matchedFields.join(', ')
                                  ),
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
