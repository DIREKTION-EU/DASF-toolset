import { UIForm } from "mithril-ui-form";
import { ICapabilityDataModel } from "./capability-model";
import { t } from "../../services/translations";

export const preparationModel = () =>
  [
    { type: "section", id: "goal_section", label: t("group_goals") },
    {
      type: "md",
      label: t("group_goals_instr"),
    },
    {
      id: "mainTasks",
      label: t("main_goals"),
      repeat: true,
      pageSize: 10,
      sortProperty: "id",
      type: [
        { id: "id", label: t("id"), type: "text", className: "col s3 m2" },
        {
          id: "label",
          label: t("goal"),
          type: "text",
          className: "col s9 m10",
        },
        {
          id: "desc",
          label: t("desc"),
          type: "textarea",
          className: "col s12",
        },
      ],
    },
    { type: "section", id: "stakeholder_section", label: t("spec_sh") },
    {
      type: "md",
      label: t("spec_sh_instr"),
    },
    {
      id: "stakeholders",
      label: t("sh_org"),
      repeat: true,
      pageSize: 20,
      propertyFilter: "label",
      type: [
        { id: "id", type: "text", label: t("acronym"), className: "col s3 m2" },
        {
          id: "label",
          label: t("org_dept"),
          type: "text",
          className: "col s9 m10",
        },
      ],
    },
    { type: "section", id: "hazard_section", label: t("hazards") },
    {
      type: "md",
      label: t("hazard_step_desc"),
    },
    {
      id: "hazardTypes",
      label: t("hazard_step_title"),
      repeat: true,
      pageSize: 20,
      propertyFilter: "label",
      type: [
        { id: "id", type: "text", className: "col s3 m2" },
        {
          id: "label",
          label: t("hazard_name"),
          type: "text",
          className: "col s5 m5",
        },
        {
          id: "category",
          label: t("TYPE"),
          type: "select",
          className: "col s4 m3",
          options: [
            { id: "natural", label: t("hazard_category_natural") },
            { id: "technical", label: t("hazard_category_technical") },
            { id: "attack", label: t("hazard_category_attack") },
          ],
        },
        {
          id: "selected",
          label: t("yes"),
          type: "checkbox",
          className: "col s12 m2",
        },
        {
          id: "description",
          label: t("hazard_description"),
          type: "textarea",
          className: "col s12",
        },
      ],
    },
    { type: "section", id: "category_section", label: t("spec_cat") },
    {
      type: "md",
      label: t("spec_cat_instr"),
    },
    {
      id: "title",
      label: t("title"),
      type: "text",
    },
    {
      id: "categories",
      label: t("cap_cat"),
      repeat: true,
      pageSize: 1,
      propertyFilter: "label",
      sortProperty: "id",
      type: [
        { id: "id", type: "text", className: "col s4 m3 l2" },
        {
          id: "label",
          type: "text",
          label: t("name"),
          className: "col s5 m6 l8",
        },
        {
          id: "color",
          type: "color",
          label: t("color"),
          className: "col s3 m3 l2",
        },
        {
          id: "desc",
          type: "textarea",
          label: t("desc"),
          className: "col s12",
        },
        {
          id: "subcategories",
          label: t("subcat"),
          repeat: true,
          propertyFilter: "label",
          sortProperty: "id",
          tabindex: 2,
          className: "col offset-s1 s11",
          type: [
            { id: "id", type: "text", className: "col s4 m3" },
            {
              id: "label",
              type: "text",
              label: t("name"),
              className: "col s8 m9",
            },
            {
              id: "desc",
              type: "textarea",
              label: t("desc"),
              className: "col s12",
            },
            {
              id: "capabilities",
              label: t("create_cap"),
              repeat: true,
              pageSize: 1,
              propertyFilter: "label",
              filterLabel: t("filter_cap"),
              sortProperty: "order",
              className: "col offset-s1 s11",
              type: [
                { id: "id", type: "autogenerate", autogenerate: "id" },
                {
                  id: "label",
                  label: t("cap"),
                  type: "text",
                  className: "col s12 m6",
                },
                {
                  id: "order",
                  label: t("order"),
                  type: "number",
                  className: "col s12 m2",
                },
                {
                  id: "hide",
                  label: t("hide"),
                  type: "switch",
                  className: "col s12 m2",
                  options: [
                    { id: "no", label: t("no") },
                    { id: "yes", label: t("yes") },
                  ],
                },
                {
                  id: "desc",
                  label: t("desc"),
                  placeholder: "desc_cap_instr",
                  type: "textarea",
                  className: "col s12",
                },
              ],
            },
          ],
        },
      ],
    },
  ] as UIForm<ICapabilityDataModel>;
