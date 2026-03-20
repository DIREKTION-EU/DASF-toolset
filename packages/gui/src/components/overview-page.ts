import m from "mithril";
import { FlatButton, TextInput } from "mithril-materialized";
import { Pages } from "../models";
import {
  ICapability,
  ICapabilityDataModel,
  CapabilityModel,
  ICategory,
  ILabelled,
} from "../models/capability-model/capability-model";
import { actions, APP_TITLE_SHORT, MeiosisComponent, t } from "../services";
import { routingSvc } from "../services/routing-service";
import { toggleSidenav } from "./layout";
import { colorPalette, formatDate, toWord } from "../utils";
import logo from "../assets/logo.svg";

type ISubcategoryVM = ILabelled & { capabilities: ICapability[] };
type ICategoryVM = ICategory & { subcategories: ISubcategoryVM[] };

const tLabel = (item: ILabelled) => t(item.id as any) || item.label;

const createTextFilter = (txt: string) => {
  if (!txt) return () => true;
  const checker = new RegExp(txt, "i");
  return ({ label = "", desc = "" }: { label: string; desc?: string }) =>
    checker.test(label) || checker.test(desc);
};

export const OverviewPage: MeiosisComponent = () => {
  let showCapAccordion = false;
  let expandedCategories = new Set<string>();
  let expandedSubcategories = new Set<string>();
  let editingCapId: string | null = null;
  let textFilter = '';

  return {
    oninit: ({ attrs }) => {
      actions.setPage(attrs, Pages.OVERVIEW);
    },
    view: ({ attrs }) => {
      const { catModel = {} as CapabilityModel, currentSessionId } = attrs.state;
      const curUser = attrs.state.curUser;
      const isEditor = curUser !== 'user';

      const { data = { categories: [], capabilities: [] } as Partial<ICapabilityDataModel> } = catModel;
      catModel.data = data;

      const {
        categories = [],
        capabilities = [],
        availableCapabilities = [],
        projectProposals = [],
        assessmentScale = [],
        logo: sessionLogo,
        title = "cat",
      } = data;

      const filterFn = createTextFilter(textFilter);
      const filteredCapabilities = capabilities.filter((c) => !c.hide).filter(filterFn);

      const filteredCategories = categories.reduce((acc, cat) => {
        const { subcategories = [], ...params } = cat;
        const category = { ...params } as ICategoryVM;
        category.subcategories = subcategories
          .map((sc) => ({
            ...sc,
            capabilities: filteredCapabilities.filter((cap) => cap.subcategoryId === sc.id),
          }))
          .filter((sc) => sc.capabilities.length > 0);
        if (category.subcategories.length > 0) acc.push(category);
        return acc;
      }, [] as ICategoryVM[]);

      const maxItems = filteredCategories.length
        ? Math.max(...filteredCategories.map((cat) =>
            Math.max(...(cat.subcategories as ISubcategoryVM[]).map((sc) => sc.capabilities.length))
          ))
        : 0;
      const height = 90 + maxItems * 30;
      const filename = `${formatDate(Date.now())}_${title}_v${catModel.version}.docx`;
      const selectedCapIds = new Set(capabilities.map((c) => c.id));
      const sessionName = currentSessionId && title ? title : '';

      return m(".overview.page", [

        // ── Compact page header ──────────────────────────────────────────────
        m(".row.dasf-page-header", { style: "display:flex; align-items:center; margin-bottom:0;" }, [
          m("div", [
            m(FlatButton, { iconName: "menu", onclick: () => toggleSidenav() }),
          ]),
          m("div", { style: "flex:1;" }, [
            m("a", {
              href: routingSvc.href(Pages.LANDING),
              style: "display:flex; align-items:center; color:inherit; text-decoration:none;",
            }, [
              m("img[width=32][height=32][alt=logo]", { src: logo, style: "margin-right:8px;" }),
              m("span.hide-on-small-only", { style: "font-size:1rem; font-weight:500;" },
                sessionName ? `${APP_TITLE_SHORT} — ${sessionName}` : APP_TITLE_SHORT
              ),
            ]),
          ]),
        ]),

        // ── Filter toolbar ───────────────────────────────────────────────────
        m(".row.dasf-filter-toolbar", { style: "align-items:center; margin-bottom:0;" }, [
          m(".col.s12.m5", [
            m(TextInput, {
              label: t("filter_caps"),
              id: "overview-filter",
              value: textFilter,
              placeholder: t("filter_ph"),
              iconName: "filter_list",
              onchange: (v?: string) => { textFilter = v || ''; },
              canClear: true,
            }),
          ]),
          m(".col.s12.m4", [
            m(FlatButton, {
              label: showCapAccordion ? t("collapse") : t("manage_capabilities"),
              iconName: showCapAccordion ? "expand_less" : "playlist_add",
              onclick: () => { showCapAccordion = !showCapAccordion; },
            }),
          ]),
          m(".col.s12.m3", [
            m(FlatButton, {
              label: t("export_to_word"),
              iconName: "download",
              onclick: () => toWord(filename, data, filteredCapabilities),
            }),
          ]),
        ]),

        // ── Capability selection accordion ───────────────────────────────────
        showCapAccordion && m(".row", [
          m(".col.s12", m(".card.dasf-cap-accordion", m(".card-content", [
            m("span.card-title", t("manage_capabilities")),
            availableCapabilities.length === 0
              ? m("p.grey-text", t("cap_all_selected"))
              : categories.map((cat) => {
                  const catExpanded = expandedCategories.has(cat.id);
                  return m("div", { key: cat.id }, [
                    m("div", {
                      style: "cursor:pointer; padding:8px 0; font-weight:bold; display:flex; align-items:center; gap:8px;",
                      onclick: () => {
                        if (catExpanded) expandedCategories.delete(cat.id);
                        else expandedCategories.add(cat.id);
                      },
                    }, [
                      m("i.material-icons.tiny", catExpanded ? "expand_less" : "expand_more"),
                      tLabel(cat),
                    ]),
                    catExpanded && (cat.subcategories || []).map((sc) => {
                      const scExpanded = expandedSubcategories.has(sc.id);
                      const scCaps = availableCapabilities.filter((c) => c.subcategoryId === sc.id);
                      if (!scCaps.length) return null;
                      return m("div", { key: sc.id, style: "margin-left:16px;" }, [
                        m("div", {
                          style: "cursor:pointer; padding:4px 0; display:flex; align-items:center; gap:8px;",
                          onclick: () => {
                            if (scExpanded) expandedSubcategories.delete(sc.id);
                            else expandedSubcategories.add(sc.id);
                          },
                        }, [
                          m("i.material-icons.tiny", scExpanded ? "expand_less" : "expand_more"),
                          tLabel(sc),
                        ]),
                        scExpanded && m(".row", scCaps.map((cap) =>
                          m(".col.s12.m6.l4", { key: cap.id }, [
                            m("label.dasf-cap-check", [
                              m("input[type=checkbox]", {
                                checked: selectedCapIds.has(cap.id),
                                onchange: (e: Event) => {
                                  const checked = (e.target as HTMLInputElement).checked;
                                  data.capabilities = checked
                                    ? [...capabilities, { ...cap }]
                                    : capabilities.filter((c) => c.id !== cap.id);
                                  actions.saveModel(attrs, catModel);
                                },
                              }),
                              m("span", tLabel(cap)),
                            ]),
                          ])
                        )),
                      ]);
                    }),
                  ]);
                }),
          ]))),
        ]),

        // ── Capability grid ──────────────────────────────────────────────────
        m("#category-list",
          filteredCategories.map(({ label, id: catId, subcategories, color }, i) =>
            m(".category", [
              i > 0 && m(".divider"),
              m(i > 0 ? ".section.row" : ".row", [
                m(".col.s12", m("h5", t(catId as any) || label)),
                subcategories &&
                  (subcategories as ISubcategoryVM[]).map((sc) =>
                    m(".category-item.col.s12.m6.l4.xl3",
                      m(".card", {
                        style: `background:${color || colorPalette[i % colorPalette.length]}; height:${height}px`,
                      },
                        m(".card-content.white-text", [
                          m("span.card-title.truncate.black-text.white.center-align", {
                            style: "padding:0.4rem; border:2px solid black;",
                          }, m("strong", tLabel(sc))),
                          m("ul.caps",
                            sc.capabilities && sc.capabilities.map((cap) => {
                              const assessment = assessmentScale.find((a) => a.id === cap.assessmentId);
                              return m("li", { key: cap.id },
                                editingCapId === cap.id && isEditor
                                  ? m(TextInput, {
                                      id: `cap-edit-${cap.id}`,
                                      value: cap.label,
                                      onchange: (v) => { cap.label = v || cap.label; actions.saveModel(attrs, catModel); },
                                      onblur: () => { editingCapId = null; },
                                      style: "background:white; color:black; padding:2px 4px;",
                                    })
                                  : m(m.route.Link, {
                                      href: actions.createRoute(Pages.ASSESSMENT),
                                      selector: "a.black-text",
                                      params: { id: cap.id },
                                      options: { replace: true },
                                    }, [
                                      m(".capability", [
                                        m(".square", {
                                          title: assessment?.label,
                                          style: `background-color:${assessment?.color}`,
                                        }),
                                        m(".name", tLabel(cap)),
                                        isEditor && m("i.material-icons.tiny", {
                                          style: "font-size:12px; cursor:pointer; margin-left:4px; opacity:0.6;",
                                          title: t("edit"),
                                          onclick: (e: Event) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            editingCapId = cap.id;
                                          },
                                        }, "edit"),
                                        m(".badges.right-align",
                                          m.trust(
                                            `${cap.gaps?.length ? `${cap.gaps.length}<i class="inline-icon material-icons">report_problem</i> ` : ""}${(cap.capabilityStakeholders as string[])?.length ? `${(cap.capabilityStakeholders as string[]).length}<i class="inline-icon material-icons">people</i> ` : ""}${cap.shouldDevelop ? "✓" : ""}${projectProposals.filter((p) => !p.approved && p.capabilityIds?.includes(cap.id)).length > 0 ? `${projectProposals.filter((p) => !p.approved && p.capabilityIds?.includes(cap.id)).length}<i class="inline-icon material-icons">lightbulb</i>` : ""}${projectProposals.filter((p) => p.approved && p.capabilityIds?.includes(cap.id)).length > 0 ? `${projectProposals.filter((p) => p.approved && p.capabilityIds?.includes(cap.id)).length}<i class="inline-icon material-icons">engineering</i>` : ""}`
                                          )
                                        ),
                                      ]),
                                    ])
                              );
                            })
                          ),
                        ])
                      )
                    )
                  ),
              ]),
            ])
          )
        ),

        sessionLogo && m(".center-align", { style: "margin-top:16px;" },
          m("img[title=Logo][width=80%]", { src: sessionLogo })
        ),
      ]);
    },
  };
};
