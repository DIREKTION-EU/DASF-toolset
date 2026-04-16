/**
 * Collaboration Page
 *
 * Facilitator view (default):
 *   A) Send Invite — choose modes, enter name/email, generate mailto
 *   B) Received Patches — load from URL ?p=, view aggregated results
 *
 * User view (when URL contains ?i=<encoded-invite>):
 *   Fill in capability assessments and click Done to send patch back.
 */
import m from "mithril";
import { actions, MeiosisComponent, t } from "../services";
import { Pages } from "../models/page";
import type { ICapability } from "../models/capability-model/capability-model";
import {
  type CollabMode,
  type CapabilityAnswer,
  type CollaborationPatch,
  type InvitePayload,
  buildInvitePayload,
  buildMailtoInvite,
  buildMailtoPatch,
  buildPatchPayload,
  decodePayload,
  aggregateCapabilityPatches,
  entityId,
  entityLabel,
} from "../services/collaboration-service";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MODES: { id: CollabMode; label: () => string }[] = [
  { id: "ca", label: () => t("collab_mode_ca") },
  { id: "sc", label: () => t("collab_mode_sc") },
  { id: "sa", label: () => t("collab_mode_sa") },
];

const capabilityFromInvite = (
  capRef: InvitePayload["c"][number],
  allCaps: ICapability[],
): ICapability | undefined => {
  const id = entityId(capRef);
  return allCaps.find((c) => c.id === id);
};

// ─── Facilitator View ─────────────────────────────────────────────────────────

const FacilitatorSendInvite: MeiosisComponent = () => {
  let sending = false;

  return {
    view: ({ attrs }) => {
      const { collaboration = {}, catModel } = attrs.state;
      const { modes = [], facilitatorInfo = {} } = collaboration;
      const data = catModel?.data ?? {};

      const toggleMode = (mode: CollabMode) => {
        const next = modes.includes(mode)
          ? modes.filter((m) => m !== mode)
          : [...modes, mode];
        actions.updateCollaboration(attrs, { modes: next });
      };

      const send = async () => {
        if (!facilitatorInfo.name || !facilitatorInfo.email || !modes.length) return;
        sending = true;
        try {
          const payload = await buildInvitePayload(
            attrs.state,
            modes,
            facilitatorInfo.name,
            facilitatorInfo.email,
            data.title ?? "1.0",
          );
          actions.updateCollaboration(attrs, {
            sessionId: payload.s,
            baseModelHash: payload.bh,
          });
          const subject = t("collab_invite_subject");
          const body = t("collab_invite_body")
            .replace(/\{facilitatorName\}/g, facilitatorInfo.name);
          const mailto = buildMailtoInvite(payload, subject, body);
          window.location.href = mailto;
        } finally {
          sending = false;
          m.redraw();
        }
      };

      return m(".collab-send-invite", [
        m("h5", t("collab_send_invite")),

        // Mode chips
        m(".collab-modes.row", [
          m(".col.s12", m("label", t("collab_select_modes"))),
          ...MODES.map((mode) =>
            m(
              ".chip",
              {
                class: modes.includes(mode.id) ? "teal white-text" : "",
                style: "cursor:pointer; margin:4px",
                onclick: () => toggleMode(mode.id),
              },
              mode.label(),
            ),
          ),
        ]),

        // Facilitator info
        m(".row", [
          m(".col.s12.m6", [
            m("label", t("collab_facilitator_name")),
            m("input[type=text]", {
              value: facilitatorInfo.name ?? "",
              oninput: (e: Event) =>
                actions.updateCollaboration(attrs, {
                  facilitatorInfo: {
                    ...facilitatorInfo,
                    name: (e.target as HTMLInputElement).value,
                  },
                }),
            }),
          ]),
          m(".col.s12.m6", [
            m("label", t("collab_facilitator_email")),
            m("input[type=email]", {
              value: facilitatorInfo.email ?? "",
              oninput: (e: Event) =>
                actions.updateCollaboration(attrs, {
                  facilitatorInfo: {
                    ...facilitatorInfo,
                    email: (e.target as HTMLInputElement).value,
                  },
                }),
            }),
          ]),
        ]),

        // Send button
        m(
          "button.btn.waves-effect.waves-light.teal",
          {
            disabled:
              sending ||
              !facilitatorInfo.name ||
              !facilitatorInfo.email ||
              !modes.length,
            onclick: send,
          },
          [m("i.material-icons.left", "send"), t("collab_generate_link")],
        ),
      ]);
    },
  };
};

// ─── Patch Loader ─────────────────────────────────────────────────────────────

const PatchLoader: MeiosisComponent = () => {
  let pasteValue = "";
  let errorMsg = "";

  const tryLoadPatch = (
    attrs: Parameters<ReturnType<MeiosisComponent>["view"]>[0]["attrs"],
    encoded: string,
  ) => {
    try {
      const patch = decodePayload<CollaborationPatch>(encoded);
      const { collaboration = {} } = attrs.state;
      const invite = collaboration.invitePayload;

      if (invite && patch.sid !== invite.s) {
        errorMsg = t("collab_session_mismatch");
        return;
      }
      if (invite && patch.bh !== invite.bh) {
        errorMsg = t("collab_hash_mismatch");
        // Still load it, just warn
      }

      const existing = collaboration.patches ?? [];
      if (existing.some((p) => p.pid === patch.pid)) {
        errorMsg = t("collab_duplicate_ignored");
        return;
      }

      actions.addPatch(attrs, patch);
      pasteValue = "";
      errorMsg = "";
    } catch {
      errorMsg = "Invalid patch link — could not decode.";
    }
    m.redraw();
  };

  return {
    oninit: ({ attrs }) => {
      // Auto-load from URL ?p= param
      const pParam = m.route.param("p");
      if (pParam) tryLoadPatch(attrs, pParam);
    },
    view: ({ attrs }) => {
      const { collaboration = {} } = attrs.state;
      const patches = collaboration.patches ?? [];

      return m(".collab-patch-loader", [
        m("h5", t("collab_load_patch")),

        // Paste input
        m(".row", [
          m(".col.s12.m9", [
            m("label", t("collab_paste_patch")),
            m("input[type=text]", {
              value: pasteValue,
              oninput: (e: Event) => {
                pasteValue = (e.target as HTMLInputElement).value;
                errorMsg = "";
              },
            }),
          ]),
          m(".col.s12.m3", { style: "padding-top:26px" }, [
            m(
              "button.btn.waves-effect.waves-light",
              {
                disabled: !pasteValue.trim(),
                onclick: () => {
                  // Extract encoded param from pasted URL or raw encoded string
                  const match = pasteValue.match(/[?&]p=([^&\s]+)/);
                  tryLoadPatch(attrs, match ? match[1] : pasteValue.trim());
                },
              },
              t("collab_load_patch_btn"),
            ),
          ]),
        ]),

        errorMsg && m(".red-text.col.s12", m("small", errorMsg)),

        // Patch list
        patches.length === 0
          ? m("p.grey-text", t("collab_no_patches"))
          : [
              m(
                "p",
                t("collab_patches_count", patches.length),
              ),
              m("table.highlight", [
                m("thead", m("tr", [
                  m("th", t("collab_contributor")),
                  m("th", t("collab_received_at")),
                  m("th", t("collab_mode_ca")),
                  m("th", ""),
                ])),
                m("tbody", patches.map((p) =>
                  m("tr", [
                    m("td", p.un ? `${p.un} (${p.ue ?? "?"})` : (p.ue ?? "—")),
                    m("td", new Date(p.at).toLocaleString()),
                    m("td", p.m.join(", ")),
                    m("td",
                      m(
                        "a.red-text",
                        {
                          style: "cursor:pointer",
                          onclick: () => actions.removePatch(attrs, p.pid),
                        },
                        [m("i.material-icons.tiny", "delete"), " ", t("collab_remove_patch")],
                      ),
                    ),
                  ]),
                )),
              ]),
              m(AggregatedResults, { ...attrs }),
            ],
      ]);
    },
  };
};

// ─── Aggregated Results Panel ─────────────────────────────────────────────────

const AggregatedResults: MeiosisComponent = () => ({
  view: ({ attrs }) => {
    const patches = attrs.state.collaboration?.patches ?? [];
    if (!patches.length) return null;

    const agg = aggregateCapabilityPatches(patches);
    if (!agg.length) return null;

    return m(".collab-aggregated", [
      m("h6", t("collab_aggregated_results")),
      m("table.striped.highlight", [
        m("thead", m("tr", [
          m("th", t("cap")),
          m("th", t("collab_avg_action_priority")),
          m("th", t("collab_task_items")),
          m("th", t("collab_perf_items")),
        ])),
        m("tbody", agg.map((a) =>
          m("tr", [
            m("td", m("code", a.capabilityId)),
            m("td", a.avgActionPriority != null
              ? a.avgActionPriority.toFixed(1)
              : "—"),
            m("td",
              a.taskItems.map((ti) =>
                m("div", [
                  m("small.grey-text", `${ti.id}: `),
                  m("strong", ti.avgValue),
                  m("small.grey-text", ` (${ti.allValues.join(", ")})`),
                ]),
              ),
            ),
            m("td",
              a.performanceItems.map((pi) =>
                m("div", [
                  m("small.grey-text", `${pi.id}: `),
                  m("strong", pi.avgValue),
                  m("small.grey-text", ` (${pi.allValues.join(", ")})`),
                ]),
              ),
            ),
          ]),
        )),
      ]),
    ]);
  },
});

// ─── User View ────────────────────────────────────────────────────────────────

const UserAssessmentView: MeiosisComponent = () => {
  // Local mutable answers keyed by capabilityId
  const answers = new Map<string, CapabilityAnswer>();

  const getOrCreate = (capId: string): CapabilityAnswer => {
    if (!answers.has(capId)) answers.set(capId, { c: capId });
    return answers.get(capId)!;
  };

  const setTaskItem = (capId: string, itemId: string, value: string) => {
    const a = getOrCreate(capId);
    a.ta = a.ta ?? { a: "", i: [] };
    const existing = a.ta.i.find((x) => x.id === itemId);
    if (existing) existing.v = value;
    else a.ta.i.push({ id: itemId, v: value });
  };

  const setPerfItem = (capId: string, itemId: string, value: string) => {
    const a = getOrCreate(capId);
    a.pa = a.pa ?? { a: "", i: [] };
    const existing = a.pa.i.find((x) => x.id === itemId);
    if (existing) existing.v = value;
    else a.pa.i.push({ id: itemId, v: value });
  };

  const setActionPriority = (capId: string, val: number) => {
    getOrCreate(capId).ap = val;
  };

  return {
    view: ({ attrs }) => {
      const { collaboration = {}, catModel } = attrs.state;
      const { invitePayload, userInfo = {} } = collaboration;
      if (!invitePayload) return null;

      const data = catModel?.data ?? {};
      const allCaps: ICapability[] = data.capabilities ?? [];
      const taskScale = data.taskScale ?? [];
      const performanceScale = data.performanceScale ?? [];
      const mainTasks = data.mainTasks ?? [];
      const performanceAspects = data.performanceAspects ?? [];

      const sendDone = () => {
        const capAnswers = Array.from(answers.values());
        const patch = buildPatchPayload(
          invitePayload,
          userInfo.name,
          userInfo.email,
          capAnswers,
          [],
          [],
        );
        const subject = t("collab_patch_subject");
        const body = t("collab_patch_body")
          .replace(/\{facilitatorName\}/g, invitePayload.fn)
          .replace(/\{userName\}/g, userInfo.name ?? "");
        const mailto = buildMailtoPatch(patch, invitePayload.fe, subject, body);
        window.location.href = mailto;
      };

      const capRefs = invitePayload.c;

      return m(".collab-user-view", [
        // Header
        m(".row", [
          m(".col.s12",
            m(
              "p.teal-text",
              t("collab_invited_by")
                .replace(/\{name\}/g, invitePayload.fn)
                .replace(/\{email\}/g, invitePayload.fe),
            ),
          ),
        ]),

        // User info
        m(".row", [
          m(".col.s12.m5", [
            m("label", t("collab_your_name")),
            m("input[type=text]", {
              value: userInfo.name ?? "",
              oninput: (e: Event) =>
                actions.updateCollaboration(attrs, {
                  userInfo: {
                    ...userInfo,
                    name: (e.target as HTMLInputElement).value,
                  },
                }),
            }),
          ]),
          m(".col.s12.m5", [
            m("label", t("collab_your_email")),
            m("input[type=email]", {
              value: userInfo.email ?? "",
              oninput: (e: Event) =>
                actions.updateCollaboration(attrs, {
                  userInfo: {
                    ...userInfo,
                    email: (e.target as HTMLInputElement).value,
                  },
                }),
            }),
          ]),
        ]),

        // Capability Assessment (ca mode)
        invitePayload.m.includes("ca") &&
          m(".ca-section", [
            m("h5", t("collab_mode_ca")),
            ...capRefs.map((capRef) => {
              const cap = capabilityFromInvite(capRef, allCaps);
              const capId = entityId(capRef);
              const capLabel = cap
                ? (t(cap.id as any) || cap.label)
                : entityLabel(capRef, capId);
              const answer = getOrCreate(capId);

              return m(".card.hoverable", [
                m(".card-content", [
                  m("span.card-title", capLabel),
                  cap?.desc && m("p.grey-text", cap.desc),

                  // Task importance per mainTask
                  mainTasks.length > 0 && [
                    m("h6", t("goal")),
                    ...mainTasks.map((task) => {
                      const currentVal =
                        answer.ta?.i.find((x) => x.id === task.id)?.v ?? "";
                      return m(".row.valign-wrapper", [
                        m(".col.s12.m5", [
                          m("label", t(task.id as any) || task.label),
                          task.desc &&
                            m("small.grey-text.block", t(`${task.id}_desc` as any) || task.desc),
                        ]),
                        m(".col.s12.m7",
                          m("select.browser-default", {
                            value: currentVal,
                            onchange: (e: Event) =>
                              setTaskItem(capId, task.id, (e.target as HTMLSelectElement).value),
                          }, [
                            m("option[value='']", "—"),
                            ...taskScale.map((s) =>
                              m("option", { value: s.id, selected: currentVal === s.id },
                                t(s.id as any) || s.label,
                              ),
                            ),
                          ]),
                        ),
                      ]);
                    }),
                  ],

                  // Performance per performanceAspect
                  performanceAspects.length > 0 && [
                    m("h6", t("perf")),
                    ...performanceAspects.map((aspect) => {
                      const currentVal =
                        answer.pa?.i.find((x) => x.id === aspect.id)?.v ?? "";
                      return m(".row.valign-wrapper", [
                        m(".col.s12.m5", [
                          m("label", t(aspect.id as any) || aspect.label),
                          aspect.desc &&
                            m("small.grey-text.block", t(`${aspect.id}_desc` as any) || aspect.desc),
                        ]),
                        m(".col.s12.m7",
                          m("select.browser-default", {
                            value: currentVal,
                            onchange: (e: Event) =>
                              setPerfItem(capId, aspect.id, (e.target as HTMLSelectElement).value),
                          }, [
                            m("option[value='']", "—"),
                            ...performanceScale.map((s) =>
                              m("option", { value: s.id, selected: currentVal === s.id },
                                t(s.id as any) || s.label,
                              ),
                            ),
                          ]),
                        ),
                      ]);
                    }),
                  ],

                  // Action priority
                  m(".row", [
                    m(".col.s12", [
                      m("label", t("action_priority")),
                      m("p.range-field",
                        m("input[type=range][min=1][max=5][step=1]", {
                          value: answer.ap ?? 3,
                          oninput: (e: Event) =>
                            setActionPriority(capId, parseInt((e.target as HTMLInputElement).value, 10)),
                        }),
                      ),
                      m(".flex-row", { style: "display:flex; justify-content:space-between" }, [
                        m("small", t("action_priority_label_1")),
                        m("small", t("action_priority_label_3")),
                        m("small", t("action_priority_label_5")),
                      ]),
                    ]),
                  ]),
                ]),
              ]);
            }),
          ]),

        // Done button
        m(".row", [
          m(".col.s12",
            m(
              "button.btn.btn-large.waves-effect.waves-light.teal",
              { onclick: sendDone },
              [m("i.material-icons.left", "send"), t("collab_done")],
            ),
          ),
        ]),
      ]);
    },
  };
};

// ─── Main Collaboration Page ──────────────────────────────────────────────────

export const CollaborationPage: MeiosisComponent = () => {
  return {
    oninit: ({ attrs }) => {
      actions.setPage(attrs, Pages.COLLABORATE);

      // Decode invite payload from URL ?i= param
      const iParam = m.route.param("i");
      if (iParam) {
        try {
          const invite = decodePayload<InvitePayload>(iParam);
          actions.updateCollaboration(attrs, { invitePayload: invite });
        } catch {
          console.warn("Failed to decode invite payload from URL");
        }
      }
    },
    view: ({ attrs }) => {
      const { collaboration = {} } = attrs.state;
      const isUserView = !!collaboration.invitePayload;

      return m(".collaboration-page.container", [
        m("h4", [m("i.material-icons.left", "group"), t("collab_page_title")]),
        isUserView
          ? m(UserAssessmentView, { ...attrs })
          : m(".row", [
              m(".col.s12.l6", m(FacilitatorSendInvite, { ...attrs })),
              m(".col.s12.l6", m(PatchLoader, { ...attrs })),
            ]),
      ]);
    },
  };
};
