import m from 'mithril';
import { Button, Icon, ModalPanel, FlatButton, TextInput } from 'mithril-materialized';
import background from '../assets/background.jpg';
import tno from '../assets/tno.svg';
import { type MeiosisComponent, t, i18n, actions, sessionService } from '../services';
import { Pages } from '../models';
import { DutchFlag, EnglishFlag } from '../utils';

export const LandingPage: MeiosisComponent = () => {
  let newSessionName = '';
  let deleteId = '';
  let deleteName = '';
  const readerAvailable = window.File && window.FileReader && window.FileList && window.Blob;

  return {
    oninit: async ({ attrs }) => {
      actions.setPage(attrs, Pages.LANDING);
      await actions.loadSessions(attrs);
    },
    view: ({ attrs }) => {
      const { sessions = [] } = attrs.state;

      return m('.landing-page', [
        // Header banner
        m('.center.black', { style: 'width: 100%; padding: 10px 0;' }, [
          m('a', { target: '_blank', href: 'https://www.tno.nl' },
            m('img.right', { style: 'margin: 15px', alt: 'TNO', src: tno, height: 40 }),
          ),
          m('h4.white-text.left', { style: 'margin: 10px 20px' },
            'DIREKTION Assessment & Screening Framework'
          ),
        ]),
        m('.center.black',
          m('img.responsive-img.center-align', {
            alt: 'DASF background',
            src: background,
            style: { 'max-height': '350px', width: '100%', 'object-fit': 'cover' },
          }),
        ),

        // Main content
        m('.container', { style: 'margin-top: 30px;' }, [
          // Language selector
          m('.row', [
            m('.col.s12.center', [
              m('.language-option', { onclick: () => actions.setLanguage(attrs, 'nl') }, [
                m('img', { src: DutchFlag, alt: 'Nederlands', title: 'Nederlands',
                  class: i18n.currentLocale === 'nl' ? 'disabled-image' : 'clickable' }),
                m('span', ' NL'),
              ]),
              m('.language-option', { onclick: () => actions.setLanguage(attrs, 'en') }, [
                m('img', { src: EnglishFlag, alt: 'English', title: 'English',
                  class: i18n.currentLocale === 'en' ? 'disabled-image' : 'clickable' }),
                m('span', ' EN'),
              ]),
            ]),
          ]),

          // Session management
          m('.row', { style: 'margin-top: 20px;' }, [
            m('.col.s12', m('h5', t('session_sessions'))),

            // Session list
            sessions.length > 0 && m('.col.s12', [
              m('table.striped.highlight', [
                m('thead', m('tr', [
                  m('th', t('session_name')),
                  m('th', t('session_updated')),
                  m('th.right-align', t('session_actions')),
                ])),
                m('tbody', sessions
                  .sort((a, b) => b.updatedAt - a.updatedAt)
                  .map(s => m('tr', [
                    m('td', m('a', {
                      href: '#',
                      onclick: (e: Event) => { e.preventDefault(); actions.openSession(attrs, s.id); },
                    }, s.name)),
                    m('td', new Date(s.updatedAt).toLocaleDateString()),
                    m('td.right-align', [
                      m(FlatButton, {
                        iconName: 'content_copy',
                        title: t('session_clone'),
                        onclick: () => actions.cloneSession(attrs, s.id),
                      }),
                      m(FlatButton, {
                        iconName: 'download',
                        title: t('session_download'),
                        onclick: async () => {
                          const json = await sessionService.exportSession(s.id);
                          if (!json) return;
                          const blob = new Blob([json], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${s.name.replace(/\s+/g, '_')}.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                        },
                      }),
                      m(FlatButton, {
                        iconName: 'delete',
                        className: 'red-text',
                        title: t('session_delete'),
                        modalId: 'deleteSession',
                        onclick: () => { deleteId = s.id; deleteName = s.name; },
                      }),
                    ]),
                  ]))
                ),
              ]),
            ]),

            // Create new session
            m('.col.s12', { style: 'margin-top: 20px;' }, [
              m('.row.valign-wrapper', [
                m('.col.s8.m6', [
                  m(TextInput, {
                    id: 'new-session-name',
                    label: t('session_new_name'),
                    initialValue: newSessionName,
                    onchange: (v) => { newSessionName = v || ''; },
                  }),
                ]),
                m('.col.s4.m2', [
                  m(Button, {
                    iconName: 'add',
                    label: t('session_create'),
                    className: 'btn',
                    disabled: !newSessionName.trim(),
                    onclick: () => {
                      if (newSessionName.trim()) {
                        actions.createSession(attrs, newSessionName.trim());
                        newSessionName = '';
                      }
                    },
                  }),
                ]),
                // Import session
                m('.col.s12.m4', [
                  m('input#importSession[type=file][accept=.json]', { style: 'display:none' }),
                  readerAvailable && m(Button, {
                    iconName: 'upload',
                    label: t('session_import'),
                    className: 'btn',
                    onclick: () => {
                      const input = document.getElementById('importSession') as HTMLInputElement;
                      input.onchange = () => {
                        if (!input.files || input.files.length === 0) return;
                        const reader = new FileReader();
                        reader.onload = async (e) => {
                          const text = e.target?.result?.toString();
                          if (!text) return;
                          try {
                            await sessionService.importSession(text);
                            await actions.loadSessions(attrs);
                          } catch (err) {
                            console.error('Import failed:', err);
                          }
                        };
                        reader.readAsText(input.files[0]);
                      };
                      input.click();
                    },
                  }),
                ]),
              ]),
            ]),
          ]),

          // DASF overview cards
          m('.section', m('.row.center', [
            m('.col.s12.m3', m('.icon-block', [
              m('.center', m(Icon, { iconName: 'warning' })),
              m('h6.center', t('step1_abbr')),
              m('p.light', t('step1_desc')),
            ])),
            m('.col.s12.m3', m('.icon-block', [
              m('.center', m(Icon, { iconName: 'assessment' })),
              m('h6.center', t('step2_abbr')),
              m('p.light', t('step2_desc')),
            ])),
            m('.col.s12.m3', m('.icon-block', [
              m('.center', m(Icon, { iconName: 'lightbulb' })),
              m('h6.center', t('step3_abbr')),
              m('p.light', t('step3_desc')),
            ])),
            m('.col.s12.m3', m('.icon-block', [
              m('.center', m(Icon, { iconName: 'timeline' })),
              m('h6.center', t('step4_abbr')),
              m('p.light', t('step4_desc')),
            ])),
          ])),

          // Attribution
          m('.footer', { style: 'padding: 20px 0; text-align: center; font-size: 10pt; color: #666;' }, [
            m('p', [
              t('landing_attribution'),
              m('br'),
              t('landing_developed_by'), ' ', m('a', { href: 'https://www.tno.nl', target: '_blank' }, 'TNO'),
              ' ', t('landing_as_part_of'), ' ', m('a', { href: 'https://www.direktion-network.org', target: '_blank' }, 'DIREKTION'), ' ', t('landing_project'),
            ]),
          ]),
        ]),

        // Delete confirmation modal
        m(ModalPanel, {
          id: 'deleteSession',
          title: t('delete_session_confirm', { name: deleteName }),
          description: t('delete_session_warning'),
          buttons: [
            {
              label: t('YES'),
              iconName: 'delete',
              onclick: () => actions.deleteSession(attrs, deleteId),
            },
            { label: t('NO'), iconName: 'cancel' },
          ],
        }),
      ]);
    },
  };
};
