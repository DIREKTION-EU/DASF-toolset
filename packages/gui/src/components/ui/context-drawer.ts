import m from 'mithril';
import { Pages } from '../../models';
import { actions, MeiosisComponent, t } from '../../services';
import { routingSvc } from '../../services/routing-service';

export const ContextDrawer: MeiosisComponent = () => {
  let _attrs: any = null;

  const closeDrawer = () => actions.closeDrawer(_attrs);

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeDrawer();
  };

  return {
    oncreate: ({ attrs }) => {
      _attrs = attrs;
      document.addEventListener('keydown', handleKey);
    },
    onupdate: ({ attrs }) => {
      _attrs = attrs;
    },
    onremove: () => {
      document.removeEventListener('keydown', handleKey);
    },
    view: ({ attrs }) => {
      const { drawerItem, catModel } = attrs.state;
      const data = catModel?.data ?? {};
      const {
        capabilities = [],
        hazardTypes = [],
        solutions = [],
        roadmapItems = [],
      } = data;

      const isOpen = !!drawerItem;

      const navigate = (page: Pages, id?: string) => {
        actions.closeDrawer(attrs);
        if (id) {
          routingSvc.switchTo(page, { id });
        } else {
          routingSvc.switchTo(page);
        }
      };

      const section = (label: string, children: m.Children) =>
        m('.context-drawer-section', [
          m('.context-drawer-label', label),
          children,
        ]);

      const tag = (text: string, color?: string) =>
        m('span.context-drawer-tag', { style: color ? `background:${color}20; color:${color}` : '' }, text);

      const link = (text: string, onclick: () => void) =>
        m('a.context-drawer-link', { onclick }, text);

      let content: m.Children = null;

      if (drawerItem) {
        if (drawerItem.type === 'capability') {
          const cap = capabilities.find(c => c.id === drawerItem.id);
          if (cap) {
            const capHazards = hazardTypes.filter(h => (cap.hazardIds || []).includes(h.id));
            const capSolutions = solutions.filter(s => (s.capabilityIds || []).includes(cap.id));
            const capRoadmapItems = roadmapItems.filter(r =>
              capSolutions.some(s => s.id === r.solutionId)
            );

            content = [
              m('.context-drawer-title', (t(cap.id as any) as string) || cap.label),

              capHazards.length > 0 && section(`${t('drawer_hazards')} (${capHazards.length})`, [
                capHazards.map(h =>
                  m('span.context-drawer-tag.clickable', {
                    key: h.id,
                    style: 'cursor:pointer',
                    onclick: () => actions.openDrawer(attrs, 'hazard', h.id),
                  }, (t(h.id as any) as string) || h.label)
                ),
              ]),

              cap.gaps && cap.gaps.length > 0 && section(`${t('drawer_gaps')} (${cap.gaps.length})`, [
                cap.gaps.map((g, i) =>
                  m('div', { key: i },
                    tag(g.title || `Gap ${i + 1}`, '#e65100')
                  )
                ),
              ]),

              section(`${t('drawer_solutions')} (${capSolutions.length})`, [
                capSolutions.length > 0
                  ? capSolutions.map(s =>
                      m('div', { key: s.id }, [
                        link(s.label, () => navigate(Pages.SOLUTIONS)),
                        s.trl != null && tag(`TRL ${s.trl}`, '#2e7d32'),
                      ])
                    )
                  : m('span.grey-text', t('drawer_none')),
                m('div.context-drawer-action', link(t('drawer_go_to_solutions'), () => navigate(Pages.SOLUTIONS))),
              ]),

              section(`${t('drawer_roadmap')} (${capRoadmapItems.length})`, [
                capRoadmapItems.length > 0
                  ? capRoadmapItems.map(r => {
                      const sol = solutions.find(s => s.id === r.solutionId);
                      return sol ? m('div', { key: r.solutionId }, link(sol.label, () => navigate(Pages.ROADMAP))) : null;
                    })
                  : m('div.context-drawer-action', link(t('drawer_add_to_roadmap'), () => navigate(Pages.ROADMAP))),
              ]),
            ];
          }
        } else if (drawerItem.type === 'hazard') {
          const hazard = hazardTypes.find(h => h.id === drawerItem.id);
          if (hazard) {
            const linkedCaps = capabilities.filter(c => (c.hazardIds || []).includes(hazard.id));
            const withGaps = linkedCaps.filter(c => c.gaps && c.gaps.length > 0);
            const withoutGaps = linkedCaps.filter(c => !c.gaps || c.gaps.length === 0);

            content = [
              m('.context-drawer-title', (t(hazard.id as any) as string) || hazard.label),
              tag(t(`hazard_category_${hazard.category}` as any)),

              withGaps.length > 0 && section(`${t('drawer_capabilities')} ${t('drawer_with_gaps')} (${withGaps.length})`, [
                withGaps.map(c =>
                  m('div', { key: c.id }, link((t(c.id as any) as string) || c.label, () => navigate(Pages.ASSESSMENT, c.id)))
                ),
              ]),

              withoutGaps.length > 0 && section(`${t('drawer_capabilities')} (${withoutGaps.length})`, [
                withoutGaps.map(c =>
                  m('div', { key: c.id }, link((t(c.id as any) as string) || c.label, () => navigate(Pages.ASSESSMENT, c.id)))
                ),
              ]),

              linkedCaps.length === 0 && m('p.grey-text', t('drawer_no_linked_caps')),
            ];
          }
        } else if (drawerItem.type === 'solution') {
          const sol = solutions.find(s => s.id === drawerItem.id);
          if (sol) {
            const solCaps = capabilities.filter(c => (sol.capabilityIds || []).includes(c.id));
            const roadmapItem = roadmapItems.find(r => r.solutionId === sol.id);

            content = [
              m('.context-drawer-title', sol.label),
              sol.trl != null && section('TRL', tag(`TRL ${sol.trl}`, '#2e7d32')),

              section(`${t('drawer_capabilities')} (${solCaps.length})`, [
                solCaps.length > 0
                  ? solCaps.map(c =>
                      m('div', { key: c.id }, link((t(c.id as any) as string) || c.label, () => navigate(Pages.ASSESSMENT, c.id)))
                    )
                  : m('span.grey-text', t('drawer_none')),
              ]),

              section(t('drawer_roadmap'), [
                roadmapItem
                  ? m('div', [
                      tag((t(`priority_${roadmapItem.priority}` as any) as string) || roadmapItem.priority || '', '#1565c0'),
                      roadmapItem.targetDate && m('span.grey-text', { style: 'margin-left:6px;font-size:12px' }, roadmapItem.targetDate!),
                      m('div.context-drawer-action', link(t('drawer_go_to_roadmap'), () => navigate(Pages.ROADMAP))),
                    ])
                  : m('div.context-drawer-action', link(t('drawer_add_to_roadmap'), () => navigate(Pages.ROADMAP))),
              ]),
            ];
          }
        } else if (drawerItem.type === 'roadmap') {
          const item = roadmapItems.find(r => r.solutionId === drawerItem.id);
          if (item) {
            const sol = solutions.find(s => s.id === item.solutionId);
            const solCaps = sol ? capabilities.filter(c => (sol.capabilityIds || []).includes(c.id)) : [];

            content = [
              m('.context-drawer-title', sol?.label || t('drawer_roadmap')),

              sol && section(t('drawer_solution'), [
                link(sol.label, () => navigate(Pages.SOLUTIONS)),
                sol.trl != null && tag(`TRL ${sol.trl}`, '#2e7d32'),
              ]),

              section(`${t('drawer_capabilities')} (${solCaps.length})`, [
                solCaps.length > 0
                  ? solCaps.map(c =>
                      m('div', { key: c.id }, link((t(c.id as any) as string) || c.label, () => navigate(Pages.ASSESSMENT, c.id)))
                    )
                  : m('span.grey-text', t('drawer_none')),
              ]),

              section(t('importance'), [
                tag((t(`priority_${item.priority}` as any) as string) || item.priority || '', '#1565c0'),
                item.targetDate && m('span.grey-text', { style: 'margin-left:6px;font-size:12px' }, item.targetDate!),
              ]),
            ];
          }
        }
      }

      return m('', [
        isOpen && m('.context-drawer-backdrop', { onclick: () => actions.closeDrawer(attrs) }),
        m('.context-drawer', { class: isOpen ? 'open' : '' }, [
          m('.context-drawer-header', [
            m('button.context-drawer-close', { onclick: () => actions.closeDrawer(attrs) }, m('i.material-icons', 'close')),
          ]),
          m('.context-drawer-body', content),
        ]),
      ]);
    },
  };
};
