import m from "mithril";
import { FlatButton, TextInput } from "mithril-materialized";
import { Pages, type CapabilityModel, type IHazardType, type HazardCategory } from "../models";
import { defaultHazardTypes } from "../models/capability-model/hazard";
import { actions, MeiosisComponent, t } from "../services";

export const HazardsPage: MeiosisComponent = () => {
  let categoryFilter: HazardCategory | 'all' = 'all';
  let editMode = false;
  let newLabel = '';
  let newCategory: HazardCategory = 'natural';

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
      const { catModel = {} as CapabilityModel, curUser } = attrs.state;
      const { data = {} } = catModel;
      const { hazardTypes = [], selectedHazardIds = [] } = data;
      const isEditor = curUser !== 'user';

      const categories: Array<{ id: HazardCategory | 'all'; label: string }> = [
        { id: 'all',       label: t('hazard_category_all') },
        { id: 'natural',   label: t('hazard_category_natural') },
        { id: 'technical', label: t('hazard_category_technical') },
        { id: 'attack',    label: t('hazard_category_attack') },
      ];

      const filtered = categoryFilter === 'all'
        ? hazardTypes
        : hazardTypes.filter(h => h.category === categoryFilter);

      const categoryColor = (cat: HazardCategory) =>
        cat === 'natural' ? '#4caf50' : cat === 'technical' ? '#2196f3' : '#f44336';

      return m('.hazards.page', [
        // 1. Title + description
        m('.row', [
          m('.col.s12', m('h4', t('hazard_step_title'))),
          m('.col.s12', m('p', t('hazard_step_desc'))),
        ]),

        // 2. Category filter chips + edit toggle
        m('.row', [
          m('.col.s12', categories.map(cat =>
            m('a.btn.waves-effect.waves-light', {
              key: cat.id,
              style: 'margin: 4px;',
              class: categoryFilter === cat.id ? '' : 'btn-flat',
              onclick: () => { categoryFilter = cat.id; },
            }, cat.label),
          )),
          isEditor && m('.col.s12', { style: 'margin-top: 10px;' }, [
            m(FlatButton, {
              iconName: editMode ? 'check' : 'edit',
              label: editMode ? t('hazard_done') : t('hazard_edit'),
              className: 'blue-text',
              onclick: () => { editMode = !editMode; },
            }),
          ]),
        ]),

        // 3. Add new hazard panel — above the list, only in edit mode
        editMode && m('.row.dasf-add-panel', [
          m('.col.s12', m('h6', t('hazard_add'))),
          m('.col.s6.m4', m(TextInput, {
            id: 'new-hazard-label',
            label: t('hazard_name'),
            value: newLabel,
            onchange: (v) => { newLabel = v || ''; },
          })),
          m('.col.s4.m3', [
            m('label', t('TYPE')),
            m('select.browser-default', {
              value: newCategory,
              onchange: (e: Event) => { newCategory = (e.target as HTMLSelectElement).value as HazardCategory; },
            }, [
              m('option', { value: 'natural' },   t('hazard_category_natural')),
              m('option', { value: 'technical' }, t('hazard_category_technical')),
              m('option', { value: 'attack' },    t('hazard_category_attack')),
            ]),
          ]),
          m('.col.s2.m2', m(FlatButton, {
            iconName: 'add',
            label: t('add_term'),
            disabled: !newLabel.trim(),
            onclick: () => {
              if (!newLabel.trim()) return;
              const id = `${newCategory[0].toUpperCase()}${String(hazardTypes.length + 1).padStart(2, '0')}`;
              const newHazard: IHazardType = { id, label: newLabel.trim(), category: newCategory };
              data.hazardTypes = [...hazardTypes, newHazard];
              actions.saveModel(attrs, catModel);
              newLabel = '';
            },
          })),
        ]),

        // 4. Selected count summary — above the list
        m('.row', [
          m('.col.s12', m('p.grey-text',
            t('hazard_selected_count', { n: (data.selectedHazardIds || []).length })
          )),
        ]),

        // 5. Hazard table
        m('.row', [
          m('.col.s12', [
            m('table.striped', [
              m('thead', m('tr', [
                m('th', { style: 'width: 40px;' }, ''),
                m('th', t('NAME')),
                m('th', t('TYPE')),
                editMode && m('th', ''),
              ])),
              m('tbody', filtered.flatMap((h) => [
                m('tr', { key: h.id }, [
                  m('td', [
                    m('label', [
                      m('input[type=checkbox]', {
                        checked: selectedHazardIds.includes(h.id) || h.selected,
                        onchange: (e: Event) => {
                          const checked = (e.target as HTMLInputElement).checked;
                          h.selected = checked;
                          data.selectedHazardIds = checked
                            ? [...selectedHazardIds, h.id]
                            : selectedHazardIds.filter(id => id !== h.id);
                          actions.saveModel(attrs, catModel);
                        },
                      }),
                      m('span'),
                    ]),
                  ]),
                  m('td', editMode
                    ? m(TextInput, {
                        id: `hazard-${h.id}`,
                        defaultValue: h.label,
                        onchange: (v) => { h.label = v || h.label; actions.saveModel(attrs, catModel); },
                      })
                    : (t(h.id as any) || h.label)
                  ),
                  m('td', m('span.dasf-badge', {
                    style: `background: ${categoryColor(h.category)}`,
                  }, t(`hazard_category_${h.category}`))),
                  editMode && m('td', m(FlatButton, {
                    iconName: 'delete',
                    className: 'red-text btn-small',
                    onclick: () => {
                      data.hazardTypes = hazardTypes.filter(x => x.id !== h.id);
                      data.selectedHazardIds = (data.selectedHazardIds || []).filter(id => id !== h.id);
                      actions.saveModel(attrs, catModel);
                    },
                  })),
                ]),
                // Description row — always visible for selected hazards, regardless of editMode
                m('tr', {
                  key: h.id + '-desc',
                  style: (selectedHazardIds.includes(h.id) || h.selected) ? '' : 'display:none',
                }, [
                  m('td'),
                  m('td', { colspan: editMode ? 3 : 2 }, [
                    m(TextInput, {
                      id: `desc-${h.id}`,
                      label: t('hazard_description'),
                      defaultValue: h.description || '',
                      onchange: (v) => { h.description = v; actions.saveModel(attrs, catModel); },
                    }),
                  ]),
                ]),
              ])),
            ]),
          ]),
        ]),
      ]);
    },
  };
};
