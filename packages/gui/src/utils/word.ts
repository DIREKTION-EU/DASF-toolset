import {
  AlignmentType,
  Document,
  ExternalHyperlink,
  HeadingLevel,
  LevelFormat,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  FileChild,
  convertInchesToTwip,
} from "docx";
import { saveAs } from "file-saver";
import { ICapability, ICapabilityDataModel } from "../models";
import {
  allSolutionReadinessConfigs,
  readinessDescriptionFieldId,
} from "../models/capability-model/readiness-levels";
import type { IRoadmapItem } from "../models/capability-model/roadmap";
import type { ISolution } from "../models/capability-model/solution";
import { t, tDynamic } from "../services";

const blue = "2F5496";

const toTable = (rows: string[][]) => {
  const table = new Table({
    width: {
      size: "100%",
      type: "auto",
    },
    rows: rows.map(
      (row, i) =>
        new TableRow({
          children: row.map(
            (cell) =>
              new TableCell({
                shading:
                  i === 0
                    ? {
                      // fill: '880aa8',
                      type: ShadingType.SOLID,
                      color: blue,
                    }
                    : undefined,
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: cell,
                        bold: i === 0,
                        color: i === 0 ? "FFFFFF" : undefined,
                      }),
                    ],
                  }),
                ],
              }),
          ),
        }),
    ),
  });
  return table;
};

export const toWord = async (
  filename: string,
  data: Partial<ICapabilityDataModel>,
  cap: ICapability | ICapability[],
) => {
  const caps = (cap instanceof Array ? cap : [cap]);

  const { title = "cat", categories: allCategories = [] } = data;
  const [catIds, subIds] = caps.reduce(
    (acc, cur) => {
      if (cur.categoryId) acc[0].add(cur.categoryId);
      if (cur.subcategoryId) acc[1].add(cur.subcategoryId);
      return acc;
    },
    [new Set<string>(), new Set<string>()],
  );

  // Build hierarchical structure if categoryId/subcategoryId are available;
  // otherwise fall back to a flat "uncategorized" section.
  const categories = catIds.size > 0
    ? allCategories
      .filter((c) => catIds.has(c.id))
      .map((c) => ({
        ...c,
        subcategories: c.subcategories?.filter((s) => subIds.has(s.id)),
      }))
    : [];

  const doc = new Document({
    creator: "TNO",
    title: `${title} Capability Assessment`,
    description: "A capability assessment.",
    styles: {
      default: {
        document: {
          run: {
            font: "Arial",
            color: "000000",
            language: {
              value: "en-UK",
            },
          },
        },
      },
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            color: blue,
            size: `18pt`,
            bold: true,
          },
          paragraph: {
            spacing: {
              before: 240,
              after: 120,
            },
          },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            color: blue,
            size: `16pt`,
            bold: true,
          },
          paragraph: {
            spacing: {
              before: 240,
              after: 120,
            },
          },
        },
        {
          id: "Heading3",
          name: "Heading 3",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            color: blue,
            size: `14pt`,
            bold: true,
          },
          paragraph: {
            spacing: {
              before: 240,
              after: 120,
            },
          },
        },
        {
          id: "Heading4",
          name: "Heading 4",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            color: blue,
            size: `12pt`,
            bold: true,
          },
          paragraph: {
            spacing: {
              before: 240,
              after: 120,
            },
          },
        },
        {
          id: "Heading5",
          name: "Heading 5",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            color: blue,
            // size: `12pt`,
            bold: true,
          },
          paragraph: {
            spacing: {
              before: 120,
              after: 60,
            },
          },
        },
        {
          id: "Heading6",
          name: "Heading 6",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            // color: blue,
            // size: `12pt`,
            bold: true,
          },
          paragraph: {
            spacing: {
              before: 120,
              after: 60,
            },
          },
        },
        {
          id: "aside",
          name: "Aside",
          basedOn: "Normal",
          next: "Normal",
          run: {
            color: "999999",
            italics: true,
          },
          paragraph: {
            indent: {
              left: 720,
            },
            spacing: {
              line: 276,
            },
          },
        },
        {
          id: "wellSpaced",
          name: "Well Spaced",
          basedOn: "Normal",
          quickFormat: true,
          paragraph: {
            spacing: {
              line: 276,
              before: 20 * 72 * 0.1,
              after: 20 * 72 * 0.05,
            },
          },
        },
        {
          id: "ListParagraph",
          name: "List Paragraph",
          basedOn: "Normal",
          quickFormat: true,
        },
      ],
    },
    numbering: {
      config: [
        {
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: "%1",
              alignment: AlignmentType.START,
              style: {
                paragraph: {
                  indent: {
                    left: convertInchesToTwip(0.5),
                    hanging: convertInchesToTwip(0.18),
                  },
                },
              },
            },
          ],
          reference: "my-numbering-reference",
        },
      ],
    },
    sections: [
      {
        children: [
          new Paragraph({
            text: t("doc_title"),
            heading: HeadingLevel.TITLE,
          }),
          ...(categories.length > 0
            ? categories.reduce((acc, category) => {
              acc.push(
                new Paragraph({
                  text: category.label,
                  heading: HeadingLevel.HEADING_1,
                }),
              );
              category.subcategories?.forEach((subcategory) => {
                acc.push(
                  new Paragraph({
                    text: subcategory.label,
                    heading: HeadingLevel.HEADING_2,
                  }),
                );
                caps
                  .filter((cap) => cap.subcategoryId === subcategory.id)
                  .forEach((cap) => acc.push(...capabilityToWord(data, cap)));
              });
              return acc;
            }, [] as FileChild[])
            : caps.flatMap((cap) => capabilityToWord(data, cap) as FileChild[])),
        ].filter((i) => i) as readonly FileChild[],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    // saveAs from FileSaver will download the blob
    saveAs(blob, filename);
  });
};

// ── Helpers for full export ───────────────────────────────────────────────────

const translatedOrFallback = (key: string, fallback: string) => {
  const translated = tDynamic(key);
  return translated && translated !== key && translated !== `@@${key}@@`
    ? translated
    : fallback;
};

const priorityLabel = (priority?: string) => {
  if (!priority) return "—";
  const key = `priority_${priority}` as any;
  return t(key) || priority;
};

const complianceValueLabel = (value?: string) => {
  if (!value || value === "na") return "N/A";
  if (value === "pass") return "✓ Pass";
  if (value === "partial") return "~ Partial";
  if (value === "fail") return "✗ Fail";
  return value;
};

const solutionToWord = (
  sol: ISolution,
  caps: ICapability[],
): FileChild[] => {
  const children: FileChild[] = [
    new Paragraph({
      text: sol.label,
      heading: HeadingLevel.HEADING_3,
    }),
  ];

  if (sol.desc) {
    children.push(new Paragraph({ text: sol.desc }));
  }

  if (sol.url) {
    children.push(
      new Paragraph({
        children: [
          new TextRun(`${tDynamic("sol_trl") || "URL"}: `),
          new ExternalHyperlink({
            children: [new TextRun({ text: sol.url, style: "Hyperlink" })],
            link: sol.url,
          }),
        ],
      }),
    );
  }

  // Readiness levels table
  const rlRows: string[][] = [
    [
      tDynamic("level") || "Readiness level",
      tDynamic("summary") || "Selected level",
      tDynamic("desc") || "Description",
    ],
  ];

  allSolutionReadinessConfigs.forEach((config) => {
    const level = (sol[config.id as keyof ISolution] as number | undefined) ??
      undefined;
    if (typeof level !== "number") return;

    const levelIndex = level - config.min;
    const selectedLevelText = translatedOrFallback(
      `${config.descriptionKeyPrefix}${level}`,
      config.descriptions[levelIndex] ?? "",
    );
    const descriptionField = readinessDescriptionFieldId(
      config.id,
    ) as keyof ISolution;
    const customDescription =
      (sol[descriptionField] as string | undefined)?.trim() || "—";

    rlRows.push([
      translatedOrFallback(config.labelKey, config.fallbackLabel),
      `${config.prefix} ${level}: ${selectedLevelText}`,
      customDescription,
    ]);
  });

  if (rlRows.length > 1) {
    children.push(toTable(rlRows));
  }

  // Linked capabilities
  const linkedCaps = caps.filter((c) => (sol.capabilityIds ?? []).includes(c.id));
  if (linkedCaps.length > 0) {
    children.push(
      new Paragraph({
        text: tDynamic("capability_gaps") || "Linked capability gaps",
        heading: HeadingLevel.HEADING_4,
      }),
      ...linkedCaps.map(
        (c) =>
          new Paragraph({
            text: c.label,
            numbering: { reference: "my-numbering-reference", level: 0 },
            contextualSpacing: true,
          }),
      ),
    );
  }

  // Assessment question sections
  const questionSections: Array<{ titleKey: string; fallback: string; items?: Array<{ id: string; label: string; value?: string }> }> = [
    { titleKey: "sol_compliance_title", fallback: "Compliance Checks", items: sol.compliance },
    { titleKey: "sol_user_needs_title", fallback: "User Needs", items: sol.userNeeds },
    { titleKey: "sol_operational_needs_title", fallback: "Operational Needs", items: sol.operationalNeeds },
    { titleKey: "sol_organisational_needs_title", fallback: "Organisational Needs", items: sol.organisationalNeeds },
    { titleKey: "sol_expected_impact_title", fallback: "Expected Impact", items: sol.expectedImpact },
  ];

  for (const section of questionSections) {
    const answered = (section.items ?? []).filter(
      (item) => item.value && item.value !== "na",
    );
    if (!answered.length) continue;
    const sectionLabel = tDynamic(section.titleKey) || section.fallback;
    const rows = [
      [sectionLabel, tDynamic("level") || "Value"],
      ...answered.map((item) => [
        item.label,
        section.titleKey === "sol_compliance_title"
          ? complianceValueLabel(item.value)
          : item.value || "—",
      ]),
    ];
    children.push(
      new Paragraph({ text: sectionLabel, heading: HeadingLevel.HEADING_4 }),
      toTable(rows),
    );
  }

  return children;
};

const roadmapToWord = (
  items: IRoadmapItem[],
  solutions: ISolution[],
): FileChild[] => {
  if (!items.length) return [];

  const rows = [
    [
      tDynamic("solutions") || "Solution",
      tDynamic("sol_trl") || "TRL",
      tDynamic("importance") || "Priority",
      tDynamic("start_time") || "Target date",
      tDynamic("proj_sum") || "Commitment",
    ],
    ...items.map((item) => {
      const sol = solutions.find((s) => s.id === item.solutionId);
      return [
        sol?.label ?? item.solutionId,
        sol?.trl !== undefined ? `TRL ${sol.trl}` : "—",
        priorityLabel(item.priority),
        item.targetDate || "—",
        item.commitment || "—",
      ];
    }),
  ];

  return [
    new Paragraph({
      text: tDynamic("roadmap_step_title") || "Roadmap",
      heading: HeadingLevel.HEADING_2,
    }),
    toTable(rows),
  ];
};

/**
 * Export the full assessment report: all capabilities (organised by
 * category/subcategory), all solutions, and the roadmap/milestones.
 */
export const toWordFull = async (
  filename: string,
  data: Partial<ICapabilityDataModel>,
) => {
  const {
    title = "cat",
    capabilities = [],
    solutions = [],
    roadmapItems = [],
    categories: allCategories = [],
  } = data;

  const [catIds, subIds] = capabilities.reduce(
    (acc, cur) => {
      if (cur.categoryId) acc[0].add(cur.categoryId);
      if (cur.subcategoryId) acc[1].add(cur.subcategoryId);
      return acc;
    },
    [new Set<string>(), new Set<string>()],
  );

  const categories =
    catIds.size > 0
      ? allCategories
        .filter((c) => catIds.has(c.id))
        .map((c) => ({
          ...c,
          subcategories: c.subcategories?.filter((s) => subIds.has(s.id)),
        }))
      : [];

  const capabilityChildren: FileChild[] =
    categories.length > 0
      ? categories.reduce((acc, category) => {
        acc.push(
          new Paragraph({
            text: category.label,
            heading: HeadingLevel.HEADING_1,
          }),
        );
        category.subcategories?.forEach((subcategory) => {
          acc.push(
            new Paragraph({
              text: subcategory.label,
              heading: HeadingLevel.HEADING_2,
            }),
          );
          capabilities
            .filter((cap) => cap.subcategoryId === subcategory.id)
            .forEach((cap) => acc.push(...capabilityToWord(data, cap)));
        });
        return acc;
      }, [] as FileChild[])
      : capabilities.flatMap((cap) => capabilityToWord(data, cap) as FileChild[]);

  const solutionChildren: FileChild[] =
    solutions.length > 0
      ? [
        new Paragraph({
          text: tDynamic("solutions") || "Solutions",
          heading: HeadingLevel.HEADING_1,
        }),
        ...solutions.flatMap((sol) => solutionToWord(sol, capabilities)),
      ]
      : [];

  const roadmapChildren: FileChild[] = roadmapToWord(roadmapItems, solutions);

  // Shared document styles/numbering identical to toWord — extracted inline
  const doc = new Document({
    creator: "TNO",
    title: `${title} Full Assessment Report`,
    description: "A full capability, solution, and roadmap assessment.",
    styles: {
      default: {
        document: {
          run: { font: "Arial", color: "000000", language: { value: "en-UK" } },
        },
      },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { color: blue, size: "18pt", bold: true }, paragraph: { spacing: { before: 240, after: 120 } } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { color: blue, size: "16pt", bold: true }, paragraph: { spacing: { before: 240, after: 120 } } },
        { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, run: { color: blue, size: "14pt", bold: true }, paragraph: { spacing: { before: 240, after: 120 } } },
        { id: "Heading4", name: "Heading 4", basedOn: "Normal", next: "Normal", quickFormat: true, run: { color: blue, size: "12pt", bold: true }, paragraph: { spacing: { before: 240, after: 120 } } },
        { id: "Heading5", name: "Heading 5", basedOn: "Normal", next: "Normal", quickFormat: true, run: { color: blue, bold: true }, paragraph: { spacing: { before: 120, after: 60 } } },
        { id: "Heading6", name: "Heading 6", basedOn: "Normal", next: "Normal", quickFormat: true, run: { bold: true }, paragraph: { spacing: { before: 120, after: 60 } } },
        { id: "ListParagraph", name: "List Paragraph", basedOn: "Normal", quickFormat: true },
      ],
    },
    numbering: {
      config: [
        {
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: "%1",
              alignment: AlignmentType.START,
              style: {
                paragraph: {
                  indent: {
                    left: convertInchesToTwip(0.5),
                    hanging: convertInchesToTwip(0.18),
                  },
                },
              },
            },
          ],
          reference: "my-numbering-reference",
        },
      ],
    },
    sections: [
      {
        children: [
          new Paragraph({
            text: tDynamic("doc_title") || `${title} Assessment Report`,
            heading: HeadingLevel.TITLE,
          }),
          ...capabilityChildren,
          ...solutionChildren,
          ...roadmapChildren,
        ].filter(Boolean) as readonly FileChild[],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
};

const capabilityToWord = (
  data: Partial<ICapabilityDataModel>,
  cap: ICapability,
) => {
  const {
    assessmentScale = [],
    stakeholders = [],
    taskScale = [],
    performanceScale = [],
    gapScale = [],
  } = data;
  const shs =
    cap.capabilityStakeholders &&
    stakeholders.filter((s) => cap.capabilityStakeholders!.includes(s.id));

  const tasks = cap.taskAssessment?.items || [];
  const assRows = [
    [t("main_goals"), t("importance"), t("expl")],
    ...tasks.map((t) => [
      t.label || "",
      taskScale.find((ts) => ts.id === t.value)?.label || "",
      t.desc || "",
    ]),
  ];

  const perf = cap.performanceAssessment?.items || [];
  const perfRows = [
    [t("perf_asps"), t("level"), t("expl")],
    ...perf.map((t) => [
      t.label || "",
      performanceScale.find((ts) => ts.id === t.value)?.label || "",
      t.desc || "",
    ]),
  ];

  const gaps = cap.gaps;
  const gapDesc =
    gaps && gaps.length > 0
      ? gaps.reduce(
        (acc, gap) => {
          const assessments = gap.gapAssessment?.items || [];
          const gapRows = [
            [t("prob_areas"), t("relevance"), t("expl")],
            ...assessments.map((t) => [
              t.label || "",
              gapScale.find((ts) => ts.id === t.value)?.label || "",
              t.desc || "",
            ]),
          ];
          const doc =
            gap.documentation &&
            new Paragraph({
              children: gap.documentation.reduce(
                (acc, doc) => {
                  acc.push(
                    new TextRun(
                      `[${doc.documentId || ""}]: ${doc.label || ""}${doc.link ? `, ` : ""}`,
                    ),
                  );
                  doc.link &&
                    acc.push(
                      new ExternalHyperlink({
                        children: [
                          new TextRun({
                            text: doc.link,
                            style: "Hyperlink",
                          }),
                        ],
                        link: doc.link,
                      }),
                    );
                  return acc;
                },
                [] as Array<TextRun | ExternalHyperlink>,
              ),
            });

          acc.push(
            new Paragraph({
              text: gap.title || "",
              heading: HeadingLevel.HEADING_5,
            }),
          );
          gap.desc &&
            acc.push(
              new Paragraph({
                text: gap.desc,
              }),
            );
          const gapStateRows: string[][] = [];
          if (gap.gapSeverity !== undefined)
            gapStateRows.push([t("gap_likert_severity"), `${gap.gapSeverity}/5`]);
          if (gap.gapProbability !== undefined)
            gapStateRows.push([t("gap_likert_probability"), `${gap.gapProbability}/5`]);
          if (gap.gapImpact !== undefined)
            gapStateRows.push([t("gap_likert_impact"), `${gap.gapImpact}/5`]);
          if (gapStateRows.length > 0) acc.push(toTable(gapStateRows));
          acc.push(toTable(gapRows));
          if (doc) {
            acc.push(
              new Paragraph({
                text: t("doc"),
                heading: HeadingLevel.HEADING_6,
              }),
            );
            acc.push(doc);
          }
          return acc;
        },
        [
          new Paragraph({
            text: t("gaps"),
            heading: HeadingLevel.HEADING_4,
          }),
        ] as Array<Paragraph | Table | undefined>,
      )
      : [];

  const stakeholderList = shs
    ? shs.map((s) => {
      return new Paragraph({
        text: s.label,
        numbering: {
          reference: "my-numbering-reference",
          level: 0,
        },
        contextualSpacing: true,
        spacing: {
          before: 200,
        },
      });
    })
    : [];

  const actionPriorityText =
    cap.actionPriority !== undefined
      ? ` | ${t("action_priority")}: ${cap.actionPriority}/5`
      : "";

  return [
    new Paragraph({
      text: `${t("cap")} "${cap.label}" - ${t("ass_overall")}: ${assessmentScale.find((ts) => ts.id === cap.assessmentId)?.label || ""
        }${actionPriorityText}`,
      heading: HeadingLevel.HEADING_3,
    }),
    new Paragraph({
      text: cap.desc,
    }),
    new Paragraph({
      text: t("shs"),
      heading: HeadingLevel.HEADING_4,
    }),
    ...stakeholderList,
    new Paragraph({
      text: `${t("goal")} - ${t("max_imp")}: ${taskScale.find((ts) => ts.id === cap.taskAssessment?.assessmentId)
          ?.label || ""
        }`,
      heading: HeadingLevel.HEADING_4,
    }),
    toTable(assRows),
    new Paragraph({
      text: `${t("perf_asps")} - ${t("avg_perf")}: ${performanceScale.find(
        (ts) => ts.id === cap.performanceAssessment?.assessmentId,
      )?.label || ""
        }`,
      heading: HeadingLevel.HEADING_4,
    }),
    toTable(perfRows),
    ...gapDesc,
    // toTable(gapRows),
  ].filter((i) => i) as readonly FileChild[];
};
