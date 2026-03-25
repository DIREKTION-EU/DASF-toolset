import m from "mithril";
import {
  Button,
  Icon,
  ConfirmButton,
  FlatButton,
  TextInput,
} from "mithril-materialized";
import background from "../assets/background.jpg";
import tno from "../assets/tno.svg";
import logoWhite from "../assets/logo-white.svg";
import direktionLogo from "../assets/direktion-logo.avif";
import euLogo from "../assets/eu-logo.avif";
import {
  type MeiosisComponent,
  t,
  i18n,
  actions,
  sessionService,
} from "../services";
import type { Languages } from "../services";
import { Pages } from "../models";

export const LandingPage: MeiosisComponent = () => {
  let newSessionName = "";
  const readerAvailable =
    window.File && window.FileReader && window.FileList && window.Blob;

  return {
    oninit: async ({ attrs }) => {
      actions.setPage(attrs, Pages.LANDING);
      await actions.loadSessions(attrs);
    },
    view: ({ attrs }) => {
      const { sessions = [] } = attrs.state;

      return m(".landing-page", [
        // Header banner
        m(
          ".center.black",
          {
            style:
              "width: 100%; padding: 10px 0; display: flex; align-items: center; justify-content: space-between;",
          },
          [
            m("img", {
              alt: "Logo",
              src: logoWhite,
              height: 50,
              style: "margin-left: 20px",
            }),
            m(
              "h4.white-text",
              { style: "margin: 10px auto; flex: 1; text-align: center;" },
              "DIREKTION Assessment & Screening Framework",
            ),
            m(
              "a",
              { target: "_blank", href: "https://www.tno.nl" },
              m("img.right", {
                style: "margin: 15px",
                alt: "TNO",
                src: tno,
                height: 40,
              }),
            ),
          ],
        ),
        m(
          ".center.black",
          m("img.responsive-img.center-align", {
            alt: "DASF background",
            src: background,
            style: {
              "max-height": "350px",
              width: "100%",
              "object-fit": "cover",
            },
          }),
        ),

        // Main content
        m(".container", { style: "margin-top: 30px;" }, [
          // Language selector
          m(".row", [
            m(
              ".col.s12.center",
              (() => {
                const langs: Array<{
                  id: Languages;
                  flag: string;
                  label: string;
                }> = [
                  { id: "nl", flag: "🇳🇱", label: "NL" },
                  { id: "en", flag: "🇬🇧", label: "EN" },
                  { id: "de", flag: "🇩🇪", label: "DE" },
                  { id: "fr", flag: "🇫🇷", label: "FR" },
                  { id: "es", flag: "🇪🇸", label: "ES" },
                  { id: "it", flag: "🇮🇹", label: "IT" },
                  { id: "pl", flag: "🇵🇱", label: "PL" },
                  { id: "pt", flag: "🇵🇹", label: "PT" },
                  { id: "sv", flag: "🇸🇪", label: "SV" },
                ];
                return langs.map(({ id, flag, label }) =>
                  m(
                    ".language-option",
                    { onclick: () => actions.setLanguage(attrs, id) },
                    [
                      m(
                        "span.flag-emoji",
                        {
                          style: "font-size: 1.6rem; line-height: 1;",
                          class:
                            i18n.currentLocale === id
                              ? "disabled-image"
                              : "clickable",
                          title: label,
                        },
                        flag,
                      ),
                      m(
                        "span.language-code",
                        {
                          style: `font-size: 0.7rem; display: block; font-weight: ${i18n.currentLocale === id ? "bold" : "normal"};`,
                        },
                        label,
                      ),
                    ],
                  ),
                );
              })(),
            ),
          ]),

          // Session management
          m(".row", { style: "margin-top: 20px;" }, [
            m(".col.s12", m("h5", t("session_sessions"))),

            // Session list
            sessions.length > 0 &&
              m(".col.s12", [
                m("table.striped.highlight", [
                  m(
                    "thead",
                    m("tr", [
                      m("th", t("session_name")),
                      m("th", t("session_updated")),
                      m("th.right-align", t("session_actions")),
                    ]),
                  ),
                  m(
                    "tbody",
                    sessions
                      .sort((a, b) => b.updatedAt - a.updatedAt)
                      .map((s) =>
                        m("tr", [
                          m(
                            "td",
                            m(
                              "a",
                              {
                                href: "#",
                                onclick: (e: Event) => {
                                  e.preventDefault();
                                  actions.openSession(attrs, s.id);
                                },
                              },
                              s.name,
                            ),
                          ),
                          m("td", new Date(s.updatedAt).toLocaleDateString()),
                          m("td.right-align", [
                            m(FlatButton, {
                              iconName: "content_copy",
                              title: t("session_clone"),
                              onclick: () => actions.cloneSession(attrs, s.id),
                            }),
                            m(FlatButton, {
                              iconName: "download",
                              title: t("session_download"),
                              onclick: async () => {
                                const json = await sessionService.exportSession(
                                  s.id,
                                );
                                if (!json) return;
                                const blob = new Blob([json], {
                                  type: "application/json",
                                });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `${s.name.replace(/\s+/g, "_")}.json`;
                                a.click();
                                URL.revokeObjectURL(url);
                              },
                            }),
                            m(ConfirmButton, {
                              iconName: "delete",
                              confirmIconName: "check",
                              title: t("session_delete"),
                              onclick: () => actions.deleteSession(attrs, s.id),
                            }),
                          ]),
                        ]),
                      ),
                  ),
                ]),
              ]),

            // Create new session
            m(".col.s12", { style: "margin-top: 20px;" }, [
              m(
                ".row.session-create-row",
                { style: "display:flex; align-items:center; gap:8px;" },
                [
                  m("div", { style: "flex:1; min-width:0;" }, [
                    m(TextInput, {
                      id: "new-session-name",
                      label: t("session_new_name"),
                      value: newSessionName,
                      oninput: (v) => {
                        newSessionName = v || "";
                      },
                    }),
                  ]),
                  m("div", [
                    m(Button, {
                      iconName: "add",
                      label: t("session_create"),
                      disabled: !newSessionName.trim(),
                      onclick: () => {
                        if (newSessionName.trim()) {
                          actions.createSession(attrs, newSessionName.trim());
                          newSessionName = "";
                        }
                      },
                    }),
                  ]),
                  // Import session
                  m("div", [
                    m("input#importSession[type=file][accept=.json]", {
                      style: "display:none",
                    }),
                    readerAvailable &&
                      m(Button, {
                        iconName: "upload",
                        label: t("session_import"),
                        onclick: () => {
                          const input = document.getElementById(
                            "importSession",
                          ) as HTMLInputElement;
                          input.onchange = () => {
                            if (!input.files || input.files.length === 0)
                              return;
                            const reader = new FileReader();
                            reader.onload = async (e) => {
                              const text = e.target?.result?.toString();
                              if (!text) return;
                              try {
                                await sessionService.importSession(text);
                                await actions.loadSessions(attrs);
                              } catch (err) {
                                console.error("Import failed:", err);
                              }
                            };
                            reader.readAsText(input.files[0]);
                          };
                          input.click();
                        },
                      }),
                  ]),
                ],
              ),
            ]),
          ]),

          // DASF overview cards
          m(
            ".section",
            m(".row.center", [
              m(
                ".col.s12.m3",
                m(".icon-block", [
                  m(".center", m(Icon, { iconName: "warning" })),
                  m("h6.center", t("step1_abbr")),
                  m("p.light", t("step1_desc")),
                ]),
              ),
              m(
                ".col.s12.m3",
                m(".icon-block", [
                  m(".center", m(Icon, { iconName: "assessment" })),
                  m("h6.center", t("step2_abbr")),
                  m("p.light", t("step2_desc")),
                ]),
              ),
              m(
                ".col.s12.m3",
                m(".icon-block", [
                  m(".center", m(Icon, { iconName: "lightbulb" })),
                  m("h6.center", t("step3_abbr")),
                  m("p.light", t("step3_desc")),
                ]),
              ),
              m(
                ".col.s12.m3",
                m(".icon-block", [
                  m(".center", m(Icon, { iconName: "timeline" })),
                  m("h6.center", t("step4_abbr")),
                  m("p.light", t("step4_desc")),
                ]),
              ),
            ]),
          ),

          // Attribution
          m(
            ".footer",
            {
              style:
                "padding: 20px 0; text-align: center; font-size: 10pt; color: #666;",
            },
            [
              m(
                ".row.valign-wrapper",
                {
                  style: "justify-content: center; gap: 24px; flex-wrap: wrap;",
                },
                [
                  m(
                    ".valign-wrapper",
                    { style: "gap: 12px; align-items: center;" },
                    [
                      m("img", { src: euLogo, alt: "EU Logo", height: 60 }),
                      m(
                        "div",
                        {
                          style:
                            "text-align: left; max-width: 160px; font-size: 9pt;",
                        },
                        [m("strong", t("landing_funded_by"))],
                      ),
                    ],
                  ),
                  m(
                    ".valign-wrapper",
                    { style: "gap: 12px; align-items: center;" },
                    [
                      m("img", {
                        src: direktionLogo,
                        alt: "DIREKTION Logo",
                        height: 60,
                      }),
                      m(
                        "div",
                        {
                          style:
                            "text-align: left; max-width: 300px; font-size: 9pt;",
                        },
                        [
                          m(
                            "p",
                            { style: "margin: 0 0 4px 0;" },
                            t("landing_attribution"),
                          ),
                          m("p", { style: "margin: 0;" }, [
                            t("landing_developed_by"),
                            " ",
                            m(
                              "a",
                              { href: "https://www.tno.nl", target: "_blank" },
                              "TNO",
                            ),
                            " ",
                            t("landing_as_part_of"),
                            " ",
                            m(
                              "a",
                              {
                                href: "https://www.direktion-network.org",
                                target: "_blank",
                              },
                              "DIREKTION",
                            ),
                            " ",
                            t("landing_project"),
                          ]),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ]),
      ]);
    },
  };
};
