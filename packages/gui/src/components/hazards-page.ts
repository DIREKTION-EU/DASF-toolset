import m from "mithril";
import { TextInput } from "mithril-materialized";
import { type CapabilityModel, type HazardCategory, Pages } from "../models";
import { defaultHazardTypes } from "../models/capability-model/hazard";
import { actions, type MeiosisComponent, t, tDynamic } from "../services";
import { translatedOrFallback } from "../utils";
import { PageNav } from "./ui";

export const HazardsPage: MeiosisComponent = () => {
  let categoryFilter: HazardCategory | "all" = "all";

  return {
    oninit: ({ attrs }) => {
      actions.setPage(attrs, Pages.HAZARDS);
      const { catModel = {} as CapabilityModel } = attrs.state;
      const { data = {} } = catModel;
      if (!data.hazardTypes || data.hazardTypes.length === 0) {
        data.hazardTypes = JSON.parse(JSON.stringify(defaultHazardTypes));
        actions.saveModel(attrs, catModel);
      }
    },
    view: ({ attrs }) => {
      const { catModel = {} as CapabilityModel } = attrs.state;
      const { data = {} } = catModel;
      const { hazardTypes = [], selectedHazardIds = [] } = data;

      const categories: Array<{ id: HazardCategory | "all"; label: string }> = [
        { id: "all", label: t("hazard_category_all") },
        { id: "natural", label: t("hazard_category_natural") },
        { id: "technical", label: t("hazard_category_technical") },
        { id: "attack", label: t("hazard_category_attack") },
      ];

      const filtered =
        categoryFilter === "all"
          ? hazardTypes
          : hazardTypes.filter((h) => h.category === categoryFilter);

      const categoryColor = (cat: HazardCategory) =>
        cat === "natural"
          ? "#4caf50"
          : cat === "technical"
            ? "#2196f3"
            : "#f44336";

      return m(".hazards.page", [
        m(PageNav, { ...attrs }),
        // 1. Title + scope input + description
        m(".row", [
          m(".col.s12", m("h4", t("hazard_step_title"))),
          m(TextInput, {
            id: "workshop-scope",
            label: t("workshop_scope"),
            defaultValue: data.workshopScope || "",
            onchange: (v) => {
              data.workshopScope = v;
              actions.saveModel(attrs, catModel);
            },
          }),
          m(".col.s12", m("p", t("hazard_step_desc"))),
        ]),

        // 2. Category filter chips
        m(".row", [
          m(
            ".col.s12",
            categories.map((cat) =>
              m(
                "a.btn.waves-effect.waves-light",
                {
                  key: cat.id,
                  style: "margin: 4px;",
                  class: categoryFilter === cat.id ? "" : "btn-flat",
                  onclick: () => {
                    categoryFilter = cat.id;
                  },
                },
                cat.label,
              ),
            ),
          ),
        ]),

        // 3. Selected count summary — above the list
        m(".row", [
          m(
            ".col.s12",
            m(
              "p.grey-text",
              t("hazard_selected_count", {
                n: (data.selectedHazardIds || []).length,
              }),
            ),
          ),
        ]),

        // 4. Hazard table
        m(".row", [
          m(".col.s12", [
            m("table.striped", [
              m(
                "thead",
                m("tr", [
                  m("th", { style: "width: 40px;" }, ""),
                  m("th", t("NAME")),
                  m("th", t("TYPE")),
                ]),
              ),
              m(
                "tbody",
                filtered.flatMap((h) => [
                  m(
                    "tr",
                    {
                      key: h.id,
                      style: "cursor:pointer",
                      onclick: () => actions.openDrawer(attrs, "hazard", h.id),
                    },
                    [
                      m("td", [
                        m("label", [
                          m("input[type=checkbox]", {
                            checked:
                              selectedHazardIds.includes(h.id) || h.selected,
                            onchange: (e: Event) => {
                              const checked = (e.target as HTMLInputElement)
                                .checked;
                              h.selected = checked;
                              data.selectedHazardIds = checked
                                ? [...selectedHazardIds, h.id]
                                : selectedHazardIds.filter((id) => id !== h.id);
                              actions.saveModel(attrs, catModel);
                            },
                          }),
                          m("span"),
                        ]),
                      ]),
                      m(
                        "td",
                        translatedOrFallback(tDynamic(h.id), h.id, h.label),
                      ),
                      m(
                        "td",
                        m(
                          "span.dasf-badge",
                          {
                            style: `background: ${categoryColor(h.category)}`,
                          },
                          t(`hazard_category_${h.category}`),
                        ),
                      ),
                    ],
                  ),
                  // Description row — always visible for selected hazards, regardless of editMode
                  m(
                    "tr",
                    {
                      key: h.id + "-desc",
                      style:
                        selectedHazardIds.includes(h.id) || h.selected
                          ? ""
                          : "display:none",
                    },
                    [
                      m("td"),
                      m("td", { colspan: 2 }, [
                        m(TextInput, {
                          id: `desc-${h.id}`,
                          label: t("hazard_description"),
                          defaultValue: h.description || "",
                          onchange: (v) => {
                            h.description = v;
                            actions.saveModel(attrs, catModel);
                          },
                        }),
                      ]),
                    ],
                  ),
                ]),
              ),
            ]),
          ]),
        ]),
      ]);
    },
  };
};
