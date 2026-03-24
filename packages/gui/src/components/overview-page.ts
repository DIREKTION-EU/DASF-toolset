import m from "mithril";
import { FlatButton, TextInput, TreeView, type TreeNode } from "mithril-materialized";
import { Pages } from "../models";
import {
  ICapability,
  ICapabilityDataModel,
  CapabilityModel,
  ICategory,
  ILabelled,
} from "../models/capability-model/capability-model";
import { actions, MeiosisComponent, t } from "../services";
import { routingSvc } from "../services/routing-service";
import { colorPalette, formatDate, toWord } from "../utils";

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
  let editingCapId: string | null = null;
  let textFilter = '';

  return {
    oninit: ({ attrs }) => {
      actions.setPage(attrs, Pages.OVERVIEW);
    },
    view: ({ attrs }) => {
      const { catModel = {} as CapabilityModel } = attrs.state;
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
        selectedHazardIds = [],
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
      return m(".overview.page", [

        // ── Filter toolbar ───────────────────────────────────────────────────
        m(".row.dasf-filter-toolbar", { style: "align-items:center; margin-bottom:0;" }, [
          m(".col.s12.m5", [
            m(TextInput, {
              label: t("filter_caps"),
              id: "overview-filter",
              value: textFilter,
              placeholder: t("filter_ph"),
              iconName: "filter_list",
              oninput: (v?: string) => { textFilter = v || ''; m.redraw(); },
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
              : (() => {
                  const availableIds = new Set(availableCapabilities.map((c) => c.id));
                  const selectedAvailableIds = capabilities.map((c) => c.id).filter((id) => availableIds.has(id));
                  const selectedSet = new Set(selectedAvailableIds);
                  const treeData: TreeNode[] = categories.reduce((acc, cat) => {
                    const scNodes = (cat.subcategories || []).reduce((sacc, sc) => {
                      const capNodes = availableCapabilities
                        .filter((c) => c.subcategoryId === sc.id)
                        .map((c) => ({ id: c.id, label: tLabel(c) }));
                      if (capNodes.length) {
                        const hasSelected = capNodes.some((n) => selectedSet.has(n.id));
                        sacc.push({ id: sc.id, label: tLabel(sc), children: capNodes, expanded: hasSelected });
                      }
                      return sacc;
                    }, [] as TreeNode[]);
                    if (scNodes.length) {
                      const hasSelected = scNodes.some((n) => n.expanded);
                      acc.push({ id: cat.id, label: tLabel(cat), children: scNodes, expanded: hasSelected });
                    }
                    return acc;
                  }, [] as TreeNode[]);
                  return m(TreeView, {
                    data: treeData,
                    selectionMode: 'multiple',
                    selectedIds: selectedAvailableIds,
                    iconType: 'caret',
                    showConnectors: true,
                    onselection: (newIds) => {
                      const newCapIds = new Set(newIds.filter((id) => availableIds.has(id)));
                      const keptCaps = capabilities.filter((c) => !availableIds.has(c.id));
                      const addedCaps = availableCapabilities.filter((c) => newCapIds.has(c.id));
                      data.capabilities = [...keptCaps, ...addedCaps];
                      actions.saveModel(attrs, catModel);
                    },
                  });
                })(),
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
                        style: `background:${color || colorPalette[i % colorPalette.length]}; height:${height}px; overflow:hidden; filter:none`,
                      },
                        m(".card-content", { style: "color:#000" }, [
                          m("span.card-title.truncate", {
                            style: "display:block; padding:0.4rem; border:2px solid #000; background:#fff; color:#000;",
                          }, m("strong", tLabel(sc))),
                          m("ul.caps",
                            sc.capabilities && sc.capabilities.map((cap) => {
                              const assessment = assessmentScale.find((a) => a.id === cap.assessmentId);
                              return m("li", { key: cap.id },
                                editingCapId === cap.id && isEditor
                                  ? m(TextInput, {
                                      id: `cap-edit-${cap.id}`,
                                      defaultValue: cap.label,
                                      onchange: (v) => { cap.label = v || cap.label; actions.saveModel(attrs, catModel); },
                                      onblur: () => { editingCapId = null; },
                                      style: "background:white; color:black; padding:2px 4px;",
                                    })
                                  : m("a.black-text", {
                                      href: routingSvc.href(Pages.ASSESSMENT, cap.id),
                                      onclick: (e: Event) => { e.preventDefault(); routingSvc.switchTo(Pages.ASSESSMENT, { id: cap.id }); },
                                      style: "display:flex; align-items:center; flex-wrap:nowrap; min-width:0;",
                                    }, [
                                      m(".capability-info", { style: "flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" }, [
                                        m(".square", {
                                          title: assessment?.label,
                                          style: `flex-shrink:0; background-color:${assessment?.color}; margin-right:8px;`,
                                        }),
                                        m(".name", { style: "display:inline-block;" }, tLabel(cap)),
                                        m(".badges",
                                          m.trust(
                                            `${selectedHazardIds.length ? `${(cap.hazardIds || []).length}<i class="inline-icon material-icons">report_problem</i> ` : ""}${(cap.capabilityStakeholders as string[])?.length ? `${(cap.capabilityStakeholders as string[]).length}<i class="inline-icon material-icons">people</i> ` : ""}${cap.shouldDevelop ? "✓" : ""}${projectProposals.filter((p) => !p.approved && p.capabilityIds?.includes(cap.id)).length > 0 ? `${projectProposals.filter((p) => !p.approved && p.capabilityIds?.includes(cap.id)).length}<i class="inline-icon material-icons">lightbulb</i>` : ""}${projectProposals.filter((p) => p.approved && p.capabilityIds?.includes(cap.id)).length > 0 ? `${projectProposals.filter((p) => p.approved && p.capabilityIds?.includes(cap.id)).length}<i class="inline-icon material-icons">engineering</i>` : ""}`
                                          )
                                        ),
                                      ]),
                                      m("i.material-icons.tiny.context-drawer-trigger", {
                                        style: "font-size:14px; cursor:pointer; margin-left:8px; opacity:0.5; flex-shrink:0;",
                                        title: t('drawer_capabilities'),
                                        onclick: (e: Event) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          actions.openDrawer(attrs, 'capability', cap.id);
                                        },
                                      }, "info_outline"),
                                      isEditor && m("i.material-icons.tiny", {
                                        style: "font-size:12px; cursor:pointer; margin-left:4px; opacity:0.6;",
                                        title: t("edit"),
                                        onclick: (e: Event) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          editingCapId = cap.id;
                                        },
                                      }, "edit"),
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
