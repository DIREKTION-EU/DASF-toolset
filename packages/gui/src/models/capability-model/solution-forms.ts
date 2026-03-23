import { UIForm } from "mithril-ui-form";
import type { ISolution } from "./solution";
import { t } from "../../services/translations";

const yesNoOptions = () => [
  { id: "yes", label: t("yes") },
  { id: "no", label: t("no") },
  { id: "partially", label: t("partially") },
  { id: "unknown", label: t("TBD") },
];

export const solutionForm = () =>
  [
    {
      id: "label",
      label: t("name"),
      type: "text",
      className: "col s12 m6",
    },
    {
      id: "url",
      label: t("url"),
      type: "url",
      className: "col s12 m6",
    },
    {
      id: "desc",
      label: t("desc"),
      type: "textarea",
      className: "col s12",
    },
    {
      id: "trl",
      label: t("sol_trl"),
      type: "number",
      min: 1,
      max: 9,
      className: "col s12 m4",
    },
    {
      id: "capabilityIds",
      label: t("sol_linked_caps"),
      type: "select",
      multiple: true,
      options: "capabilities",
      className: "col s12 m8",
    },
    {
      id: "compliance-section",
      type: "section",
      label: t("sol_compliance_title"),
    },
    {
      id: "compliance",
      label: t("sol_compliance_title"),
      repeat: true,
      pageSize: 10,
      type: [
        {
          id: "label",
          label: t("cat"),
          type: "text",
          readonly: true,
          className: "col s6 m4",
        },
        {
          id: "value",
          label: t("sol_status"),
          type: "select",
          options: [
            { id: "pass", label: t("sol_pass") },
            { id: "partial", label: t("sol_partial") },
            { id: "fail", label: t("sol_fail") },
            { id: "na", label: t("sol_na") },
          ],
          className: "col s6 m4",
        },
      ],
    },
    {
      id: "user-needs-section",
      type: "section",
      label: t("sol_user_needs_title"),
    },
    {
      id: "userNeeds",
      label: t("sol_user_needs_title"),
      repeat: true,
      pageSize: 10,
      type: [
        {
          id: "label",
          label: t("sol_question"),
          type: "text",
          readonly: true,
          className: "col s8",
        },
        {
          id: "value",
          label: t("sol_response"),
          type: "select",
          options: yesNoOptions(),
          className: "col s4",
        },
      ],
    },
    {
      id: "operational-needs-section",
      type: "section",
      label: t("sol_operational_needs_title"),
    },
    {
      id: "operationalNeeds",
      label: t("sol_operational_needs_title"),
      repeat: true,
      pageSize: 10,
      type: [
        {
          id: "label",
          label: t("sol_question"),
          type: "text",
          readonly: true,
          className: "col s8",
        },
        {
          id: "value",
          label: t("sol_response"),
          type: "select",
          options: yesNoOptions(),
          className: "col s4",
        },
      ],
    },
    {
      id: "organisational-needs-section",
      type: "section",
      label: t("sol_organisational_needs_title"),
    },
    {
      id: "organisationalNeeds",
      label: t("sol_organisational_needs_title"),
      repeat: true,
      pageSize: 10,
      type: [
        {
          id: "label",
          label: t("sol_question"),
          type: "text",
          readonly: true,
          className: "col s8",
        },
        {
          id: "value",
          label: t("sol_response"),
          type: "select",
          options: yesNoOptions(),
          className: "col s4",
        },
      ],
    },
    {
      id: "expected-impact-section",
      type: "section",
      label: t("sol_expected_impact_title"),
    },
    {
      id: "expectedImpact",
      label: t("sol_expected_impact_title"),
      repeat: true,
      pageSize: 10,
      type: [
        {
          id: "label",
          label: t("sol_question"),
          type: "text",
          readonly: true,
          className: "col s8",
        },
        {
          id: "value",
          label: t("sol_response"),
          type: "select",
          options: yesNoOptions(),
          className: "col s4",
        },
      ],
    },
  ] as UIForm<ISolution>;
