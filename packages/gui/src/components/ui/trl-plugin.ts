import m from "mithril";
import { InputField, PluginType } from "mithril-ui-form";
import { t } from "../../services/translations";

type TrlFieldType = InputField & {
  label?: string;
  min?: number;
  max?: number;
  prefix?: string;
  descriptionKeys?: string[];
  descriptions?: string[];
  colors?: string[];
};

const DEFAULT_COLORS = [
  "#d32f2f",
  "#e64a19",
  "#f57c00",
  "#fbc02d",
  "#afb42b",
  "#7cb342",
  "#388e3c",
  "#1976d2",
  "#0288d1",
  "#5e35b1",
];

const stringifyTranslation = (value: unknown) =>
  Array.isArray(value) ? value.join("") : value == null ? "" : `${value}`;

const translatedOrFallback = (key: string, fallback = "") => {
  const translated = stringifyTranslation(t(key as any));
  return translated && translated !== key && translated !== `@@${key}@@`
    ? translated
    : fallback;
};

export const trlPlugin: PluginType = () => {
  return {
    view: ({ attrs: { field, obj, onchange } }) => {
      const {
        id = "",
        label,
        readonly,
        min = 1,
        max = 9,
        prefix = "TRL",
        descriptionKeys,
        descriptions,
        colors,
      } = field as TrlFieldType;
      if (obj instanceof Array) return;

      const levels = Array.from({ length: max - min + 1 }, (_, i) => min + i);
      const value: number = (obj[id] as number) || min;

      const updateValue = (v: number) => {
        obj[id] = v;
        onchange && onchange(v);
      };

      const valueIndex = value - min;
      const descKey =
        value >= min && value <= max
          ? (descriptionKeys?.[valueIndex] ?? `trl${value}`)
          : undefined;
      const fallbackDesc = descriptions?.[valueIndex] ?? "";
      const desc = descKey ? translatedOrFallback(descKey, fallbackDesc) : "";

      const sliderColors =
        colors && colors.length > 0 ? colors : DEFAULT_COLORS;
      const color =
        value >= min && value <= max
          ? sliderColors[Math.min(valueIndex, sliderColors.length - 1)]
          : "#9e9e9e";

      return m(".trl-plugin.col.s12", [
        label && m("label.trl-label", label),
        m(".trl-slider-wrapper", [
          m("input.trl-range[type=range]", {
            min,
            max,
            step: 1,
            value,
            disabled: readonly,
            oninput: (e: Event) => {
              updateValue(parseInt((e.target as HTMLInputElement).value, 10));
            },
          }),
          m(
            ".trl-markers",
            levels.map((level) =>
              m(
                "span.trl-marker",
                {
                  class: value === level ? "active" : "",
                  onclick: readonly ? undefined : () => updateValue(level),
                },
                level,
              ),
            ),
          ),
        ]),
        value >= min &&
          m(".trl-value-display", { style: { borderLeftColor: color } }, [
            m(
              "span.trl-badge",
              { style: { background: color } },
              `${prefix} ${value}`,
            ),
            m("span.trl-desc", desc),
          ]),
      ]);
    },
  };
};
