import m from "mithril";
import { InputField, PluginType } from "mithril-ui-form";
import { t } from "../../services/translations";

type TrlFieldType = InputField & {
  label?: string;
};

const TRL_KEYS = [
  "trl1",
  "trl2",
  "trl3",
  "trl4",
  "trl5",
  "trl6",
  "trl7",
  "trl8",
  "trl9",
] as const;

export const trlPlugin: PluginType = () => {
  return {
    view: ({ attrs: { field, obj, onchange } }) => {
      const { id = "", label, readonly } = field as TrlFieldType;
      if (obj instanceof Array) return;

      const value: number = (obj[id] as number) || 0;

      const updateValue = (v: number) => {
        obj[id] = v;
        onchange && onchange(v);
      };

      const descKey = value >= 1 && value <= 9 ? TRL_KEYS[value - 1] : null;
      const desc = descKey ? (t(descKey as any) as string) : "";

      const trlColors = [
        "#d32f2f", // TRL 1 - red
        "#e64a19", // TRL 2
        "#f57c00", // TRL 3
        "#fbc02d", // TRL 4 - amber
        "#afb42b", // TRL 5
        "#7cb342", // TRL 6
        "#388e3c", // TRL 7 - green
        "#1976d2", // TRL 8 - blue
        "#0288d1", // TRL 9
      ];
      const color = value >= 1 && value <= 9 ? trlColors[value - 1] : "#9e9e9e";

      return m(".trl-plugin.col.s12", [
        label && m("label.trl-label", label),
        m(".trl-slider-wrapper", [
          m("input.trl-range[type=range]", {
            min: 1,
            max: 9,
            step: 1,
            value: value || 1,
            disabled: readonly,
            oninput: (e: Event) => {
              updateValue(parseInt((e.target as HTMLInputElement).value, 10));
            },
          }),
          m(".trl-markers", TRL_KEYS.map((_, i) =>
            m(
              "span.trl-marker",
              {
                key: i + 1,
                class: value === i + 1 ? "active" : "",
                onclick: readonly ? undefined : () => updateValue(i + 1),
              },
              i + 1,
            ),
          )),
        ]),
        value >= 1 &&
          m(".trl-value-display", { style: { borderLeftColor: color } }, [
            m("span.trl-badge", { style: { background: color } }, `TRL ${value}`),
            m("span.trl-desc", desc),
          ]),
      ]);
    },
  };
};
