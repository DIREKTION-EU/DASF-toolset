import type { Assessment, AssessmentItem } from "./assessment";
import type { IHazardType } from "./hazard";
import type { ISolution } from "./solution";
import type { IRoadmapItem } from "./roadmap";
import { lexicon } from "./lexicon";

export type ProjectProposal = {
  id: number;
  label?: string;
  start?: string;
  duration?: string;
  proposal?: string;
  capabilityIds?: string[];
  projectStakeholders?: Array<{
    stakeholderId?: string;
    persons?: string;
  }>;
  gapAssessment?: Array<{
    id: string;
    value?: string;
    desc?: string;
  }>;
  performanceAssessment?: Array<{
    id: string;
    value?: string;
    desc?: string;
  }>;
  approved?: boolean;
};

export interface ICapabilityDataModel {
  enableSolutionAssessmentSupport?: boolean;
  title?: string;
  logo?: string;
  attributionLogo?: string;
  attributionText?: string;
  stakeholders?: IStakeholder[];
  stakeholderTypes?: ILabelled[];
  categories?: ICategory[];
  capabilities?: ICapability[];
  availableCapabilities?: ICapability[];
  projectProposals?: Array<ProjectProposal>;
  mainTasks?: ILabelled[];
  taskScale?: ILabelled[];
  performanceAspects?: ILabelled[];
  performanceScale?: ILabelled[];
  assessmentTable?: Array<{ rowId: string; colId: string; optionId: string }>;
  assessmentScale?: ILabelled[];
  mainGaps?: ILabelled[];
  gapScale?: ILabelled[];
  lexicon: Array<ILabelled & { ref?: string; url?: string }>;
  // DASF additions
  hazardTypes?: IHazardType[];
  selectedHazardIds?: string[];
  solutions?: ISolution[];
  roadmapItems?: IRoadmapItem[];
  enabledSteps?: number[];
}

export type Evaluation = {
  evaluation: string;
};

export type ProjectEvaluation = Evaluation & {
  label: string;
  start: string;
  duration: string;
  capabilityIds: string[];
  proposal: string;
  projectStakeholders: {
    stakeholderId: string[];
    persons: string;
  };
  gapAssessment: Assessment;
  performanceAssessment: Assessment;
};

export type CapabilityModel = {
  version?: number;
  lastUpdate?: number;
  data: Partial<ICapabilityDataModel>;
};

export interface ILabelled {
  id: string;
  label: string;
  desc?: string;
  placeholder?: string;
  color?: string;
  value?: string;
}

export interface ICategory extends ILabelled {
  subcategories: ILabelled[];
}

export type Documentation = {
  documentId?: string;
  label?: string;
  link?: string;
};

export interface ICapability extends ILabelled {
  /** Used for sorting */
  order?: number;
  /** In case true, do not show the capability in the overview */
  hide?: boolean;
  categoryId: string;
  subcategoryId: string;
  desc?: string;
  goal?: string;
  capabilityStakeholders?: string | string[];
  documentation?: Documentation[];
  assessmentId?: string;
  hazardIds?: string[];
  shouldDevelop?: boolean;
  taskAssessment?: AssessmentItem;
  performanceAssessment?: AssessmentItem;
  gaps?: {
    title?: string;
    desc?: string;
    gapAssessment?: AssessmentItem;
    documentation?: Documentation[];
  }[];
}

export interface IStakeholder extends ILabelled {
  typeId: string;
}

// V60 capability model - DASF disaster management domain
const DEFAULT_MODEL_DATA: Partial<ICapabilityDataModel> = {
  title: "DIREKTION Assessment and Screening Tool",
  enabledSteps: [1, 2, 3, 4],
  stakeholderTypes: [
    { id: "TO-01", label: "Fire brigade / Civil protection" },
    { id: "TO-02", label: "Police" },
    { id: "TO-03", label: "Emergency health care" },
    { id: "TO-04", label: "Defence" },
    { id: "TO-05", label: "Command centre" },
    { id: "TO-06", label: "Authorities" },
    { id: "TO-07", label: "Critical infrastructure" },
    { id: "TO-08", label: "NGO" },
    { id: "TO-09", label: "Other" },
  ],
  stakeholders: [
    { id: "SH-01", label: "Fire brigade/Civil protection", typeId: "TO-01" },
    { id: "SH-02", label: "Police", typeId: "TO-02" },
    { id: "SH-03", label: "Emergency health care", typeId: "TO-03" },
    { id: "SH-04", label: "SAR", typeId: "TO-01" },
    { id: "SH-05", label: "Command or Dispatch centre (112)", typeId: "TO-05" },
    {
      id: "SH-06",
      label: "Authorities (ministries, municipalities)",
      typeId: "TO-06",
    },
    { id: "SH-07", label: "Defence", typeId: "TO-04" },
    { id: "SH-08", label: "Public services", typeId: "TO-06" },
    { id: "SH-09", label: "Coast guard or Border security", typeId: "TO-02" },
    { id: "SH-10", label: "Critical infrastructure operator", typeId: "TO-07" },
    { id: "SH-11", label: "NGO", typeId: "TO-08" },
    { id: "SH-12", label: "Other (to be described)", typeId: "TO-09" },
  ],
  categories: [
    {
      id: "Cat-01",
      label: "Mitigation / Prevention",
      desc: "Objective: To take measures to limit the probability and to reduce the impact of an incident, disaster or crises.",
      subcategories: [
        {
          id: "Mit-01",
          label: "Risk assessment",
          desc: "Identification, analysis and evaluation of risks.",
        },
        {
          id: "Mit-02",
          label: "Exposure reduction",
          desc: "Protection of properties, natural resources and society in general from hazards.",
        },
        {
          id: "Mit-03",
          label: "Mitigation support",
          desc: "Capabilities in support of Mitigation / Prevention",
        },
      ],
    },
    {
      id: "Cat-02",
      label: "Preparedness",
      desc: "Objective: To develop and maintain the organisation structure and the capabilities to carry out response and recovery activities.",
      subcategories: [
        {
          id: "Prep-01",
          label: "Capacity development",
          desc: "Process of developing and maintaining required crisis management capacities.",
        },
        {
          id: "Prep-02",
          label: "Monitoring",
          desc: "Determine the status of an environment or situation to enable detection of incidents.",
        },
        {
          id: "Prep-03",
          label: "Preparedness support",
          desc: "Capabilities in support of capacity development.",
        },
      ],
    },
    {
      id: "Cat-03",
      label: "Response",
      desc: "Objective: To save lives and to limit adverse effects.",
      subcategories: [
        {
          id: "Rsp-01",
          label: "Suppress incident",
          desc: "On-site activities to stop or to contain the cause of the disaster.",
        },
        {
          id: "Rsp-02",
          label: "Rescue operations",
          desc: "On-site activities to save lives.",
        },
        {
          id: "Rsp-03",
          label: "Security/Law enforcement",
          desc: "Securing areas/persons, Identification of persons, Forensics.",
        },
        {
          id: "Rsp-04",
          label: "Emergency Health Care",
          desc: "Off-site activities to save lives.",
        },
        {
          id: "Rsp-05",
          label: "Communicate to society",
          desc: "Warning and Crisis communication.",
        },
        {
          id: "Rsp-06",
          label: "Safeguard population/animals",
          desc: "Controlled evacuation of persons and/or animals.",
        },
        {
          id: "Rsp-07",
          label: "Disaster area clearance",
          desc: "Arrange accessibility to and safety in the affected area.",
        },
        {
          id: "Rsp-08",
          label: "Basic needs supply",
          desc: "Supply and/or restoration of basic products and services of vital importance.",
        },
        {
          id: "Rsp-09",
          label: "Response support",
          desc: "Capabilities to enable one or more other response capabilities.",
        },
      ],
    },
    {
      id: "Cat-04",
      label: "Recovery",
      desc: "Objective: To reconstruct and restore normal life in an efficient way.",
      subcategories: [
        {
          id: "Rec-01",
          label: "Humanitarian recovery",
          desc: "Provision of public health and safety services and shelter.",
        },
        {
          id: "Rec-02",
          label: "Environmental recovery",
          desc: "Clearance of pollution and decontamination.",
        },
        {
          id: "Rec-03",
          label: "Economic recovery",
          desc: "Economic and business recovery.",
        },
        {
          id: "Rec-04",
          label: "Re-establishment of infrastructure",
          desc: "Restoration of transport routes and essential services.",
        },
        {
          id: "Rec-05",
          label: "Recovery support",
          desc: "Capabilities required to recover in a well-coordinated way.",
        },
      ],
    },
  ],
  capabilities: [],
  availableCapabilities: [
    {
      id: "Mit-RA-01",
      categoryId: "Cat-01",
      subcategoryId: "Mit-01",
      label: "Risk identification",
      desc: "Process of finding, recognising and describing risk.",
      capabilityStakeholders: [],
    },
    {
      id: "Mit-RA-02",
      categoryId: "Cat-01",
      subcategoryId: "Mit-01",
      label: "Risk analysis",
      desc: "Process to comprehend the nature of risk and to determine the level of risk.",
      capabilityStakeholders: [],
    },
    {
      id: "Mit-RA-03",
      categoryId: "Cat-01",
      subcategoryId: "Mit-01",
      label: "Risk evaluation",
      desc: "Process of comparing the results of risk analysis with risk criteria to determine whether the risk and/or its magnitude is acceptable or tolerable.",
      capabilityStakeholders: [],
    },
    {
      id: "Mit-ER-01",
      categoryId: "Cat-01",
      subcategoryId: "Mit-02",
      label: "Property protection",
      desc: "Property protection (incl. critical infrastructures).",
      capabilityStakeholders: [],
    },
    {
      id: "Mit-ER-02",
      categoryId: "Cat-01",
      subcategoryId: "Mit-02",
      label: "Natural resource protection",
      desc: "Actions that minimize hazard losses and preserve or restore the functions of natural systems.",
      capabilityStakeholders: [],
    },
    {
      id: "Mit-ER-03",
      categoryId: "Cat-01",
      subcategoryId: "Mit-02",
      label: "Awareness raising",
      desc: "Public education and awareness raising about hazards and potential ways to mitigate them.",
      capabilityStakeholders: [],
    },
    {
      id: "Mit-MS-01",
      categoryId: "Cat-01",
      subcategoryId: "Mit-03",
      label: "Trend analysis",
      desc: "Investigation of the evolution of risks.",
      capabilityStakeholders: [],
    },
    {
      id: "Mit-MS-02",
      categoryId: "Cat-01",
      subcategoryId: "Mit-03",
      label: "Monitoring and review",
      desc: "Ensuring controls are effective and efficient, obtaining further information to improve risk assessment.",
      capabilityStakeholders: [],
    },
    {
      id: "Prep-CD-01",
      categoryId: "Cat-02",
      subcategoryId: "Prep-01",
      label: "Response and recovery planning",
      desc: "Develop, compile and maintain procedures and information in readiness for use in an incident.",
      capabilityStakeholders: [],
    },
    {
      id: "Prep-CD-02",
      categoryId: "Cat-02",
      subcategoryId: "Prep-01",
      label: "Training",
      desc: "Activities to facilitate learning and development of knowledge, skills, and abilities for disaster response.",
      capabilityStakeholders: [],
    },
    {
      id: "Prep-CD-03",
      categoryId: "Cat-02",
      subcategoryId: "Prep-01",
      label: "Risk communication",
      desc: "Communicating and instructing the public how to be well-prepared for a crisis and how to behave when it occurs.",
      capabilityStakeholders: [],
    },
    {
      id: "Prep-MO-01",
      categoryId: "Cat-02",
      subcategoryId: "Prep-02",
      label: "Detection",
      desc: "Detection of circumstances deviating from normal.",
      capabilityStakeholders: [],
    },
    {
      id: "Prep-MO-02",
      categoryId: "Cat-02",
      subcategoryId: "Prep-02",
      label: "Alert",
      desc: "Alert personnel to the presence of an incident and allow control actions to be initiated.",
      capabilityStakeholders: [],
    },
    {
      id: "Prep-PS-01",
      categoryId: "Cat-02",
      subcategoryId: "Prep-03",
      label: "Personnel management",
      desc: "Activities to provide enough and skilled personnel required to carry out response and recovery tasks.",
      capabilityStakeholders: [],
    },
    {
      id: "Prep-PS-02",
      categoryId: "Cat-02",
      subcategoryId: "Prep-03",
      label: "Asset management",
      desc: "Activities to provide equipment, tools, ICT and other assets required to enable response and recovery.",
      capabilityStakeholders: [],
    },
    {
      id: "Prep-PS-03",
      categoryId: "Cat-02",
      subcategoryId: "Prep-03",
      label: "Cooperation establishment",
      desc: "International cooperation establishment between emergency services and third parties.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-SI-01",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-01",
      label: "Firefighting - Infrastructures",
      desc: "Fighting fires in buildings, built-up areas or at infrastructures.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-SI-02",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-01",
      label: "Firefighting - Nature",
      desc: "Fighting fires in natural environments.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-SI-03",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-01",
      label: "Flood control",
      desc: "Water management in case of a flooding due to a dike burst or heavy rainfall.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-SI04",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-01",
      label: "Hazmat control (CBRN-E)",
      desc: "Stop spill of hazardous materials, including containment (CBRN-E incidents).",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-RO-01",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-02",
      label: "Search and Rescue (SAR)",
      desc: "Search and rescue operations.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-RO-02",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-02",
      label: "On-site casualty treatment",
      desc: "Triage, decontamination and stabilisation of victims.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-RO-03",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-02",
      label: "Transport of victims",
      desc: "Ambulance transport to safe areas or hospitals.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-SL-01",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-03",
      label: "Securing locations/persons",
      desc: "Protect areas, infrastructures, and persons from uninvolved parties.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-SL-02",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-03",
      label: "Identification of persons",
      desc: "Identification of victims.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-SL-03",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-03",
      label: "Forensics",
      desc: "Forensic activities to investigate the cause of the incident and safeguard evidence.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-SL-04",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-03",
      label: "Maintain public order",
      desc: "Riot control, etc.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-SL-05",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-03",
      label: "Traffic management",
      desc: "Traffic control both in-going and out-going the affected area.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-EH-01",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-04",
      label: "Urgent care - Hospitals",
      desc: "Health service in regular and/or field hospitals.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-EH-02",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-04",
      label: "Quarantine",
      desc: "Isolation of potentially infectious persons/victims.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-EH-03",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-04",
      label: "Mass public health",
      desc: "Mass prophylaxis or vaccination in case of a nuclear incident or pandemic.",
      capabilityStakeholders: [],
    },
    {
      id: "Prep-EH-04",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-04",
      label: "Psychological care",
      desc: "Psychological health care to victims, relatives and other people affected by the incident.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-CS-01",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-05",
      label: "Warning",
      desc: "Warn society in the threatened zone by providing timely and adequate information on the threat.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-CS-02",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-05",
      label: "Crisis communication",
      desc: "Providing information on the disaster to the society including volunteer management and appeals.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-SF-01",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-06",
      label: "Evacuate",
      desc: "Controlled evacuation of persons and animals from a certain area or building.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-SF-02",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-06",
      label: "Shelter",
      desc: "Provision of shelter to evacuees, including nutrition and sanitation.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-SF-03",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-06",
      label: "Reunification",
      desc: "Reunification of evacuees with their relatives.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-DA-01",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-07",
      label: "Debris clearance",
      desc: "Removal of debris and/or contaminated material.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-DA-02",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-07",
      label: "Decontamination of objects",
      desc: "Decontamination of contaminated areas, infrastructures and/or vehicles.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-DA-03",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-07",
      label: "Draining",
      desc: "Draining and pumping of inundated areas or infrastructures.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-DA-04",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-07",
      label: "Animal destruction",
      desc: "Destruction of potentially infected animals.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-BN-01",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-08",
      label: "Drinking water supply",
      desc: "Restoration or temporary provision of drinking water.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-BN-02",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-08",
      label: "Food supply",
      desc: "Temporary provision of food.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-BN-03",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-08",
      label: "Energy supply",
      desc: "Restoration of electricity/gas supply or provision of temporary alternative energy.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-BN-04",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-08",
      label: "Provision of ICT/Telecom",
      desc: "Restoration or temporary supply of ICT and Telecommunication.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-BN-05",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-08",
      label: "Provide sanitation",
      desc: "Restore sanitation or provide temporary solutions.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-RS-01",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-09",
      label: "Command, Control and Coordination",
      desc: "Decision-making, planning and tasking at coordination and command levels managing a disaster event.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-RS-02",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-09",
      label: "Situation assessment",
      desc: "Development of operational information through enrichment of collected data, including Common Operational Picture.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-RS-03",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-09",
      label: "Information management",
      desc: "Storing and sharing of information such as collected data, assessments and decisions taken.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-RS-04",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-09",
      label: "Monitoring/Data collection",
      desc: "Collection of data by physical monitoring (surveillance) and data-mining.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-RS-05",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-09",
      label: "On-site operations support",
      desc: "Supply of basic services to first responders on-site to enable response activities.",
      capabilityStakeholders: [],
    },
    {
      id: "Resp-RS-06",
      categoryId: "Cat-03",
      subcategoryId: "Rsp-09",
      label: "Logistics",
      desc: "Transport of personnel and materiel to support sustained disaster response operations.",
      capabilityStakeholders: [],
    },
    {
      id: "Rec-HR-01",
      categoryId: "Cat-04",
      subcategoryId: "Rec-01",
      label: "Provide public health & safety",
      desc: "Provision of public health and safety services for those displaced.",
      capabilityStakeholders: [],
    },
    {
      id: "Rec-HR-02",
      categoryId: "Cat-04",
      subcategoryId: "Rec-01",
      label: "Provide food and shelter",
      desc: "Provision of food and shelter for those displaced.",
      capabilityStakeholders: [],
    },
    {
      id: "Rec-ER-01",
      categoryId: "Cat-04",
      subcategoryId: "Rec-02",
      label: "Waste management",
      desc: "Clearance of large-scale pollution and decontamination, and dealing with waste.",
      capabilityStakeholders: [],
    },
    {
      id: "Rec-ER-02",
      categoryId: "Cat-04",
      subcategoryId: "Rec-02",
      label: "Restoration habitats",
      desc: "Restoration of natural resources and habitats.",
      capabilityStakeholders: [],
    },
    {
      id: "Rec-EC-01",
      categoryId: "Cat-04",
      subcategoryId: "Rec-03",
      label: "Business recovery",
      desc: "Business recovery of shops and industry that suffered from the disaster.",
      capabilityStakeholders: [],
    },
    {
      id: "Rec-EC-02",
      categoryId: "Cat-04",
      subcategoryId: "Rec-03",
      label: "Financial recovery",
      desc: "Recovery from financial impact on authorities.",
      capabilityStakeholders: [],
    },
    {
      id: "Rec-RI-01",
      categoryId: "Cat-04",
      subcategoryId: "Rec-04",
      label: "Re-establish transport",
      desc: "Re-establishment of transport routes (road, rail, water, air, pipelines).",
      capabilityStakeholders: [],
    },
    {
      id: "Rec-RI-02",
      categoryId: "Cat-04",
      subcategoryId: "Rec-04",
      label: "Re-establish utilities",
      desc: "Restoration of interrupted utilities and other essential services.",
      capabilityStakeholders: [],
    },
    {
      id: "Rec-RS-01",
      categoryId: "Cat-04",
      subcategoryId: "Rec-05",
      label: "Establish recovery organisation",
      desc: "Establishment of recovery organisation structure for both short-term and long-term recovery.",
      capabilityStakeholders: [],
    },
    {
      id: "Rec-RS-02",
      categoryId: "Cat-04",
      subcategoryId: "Rec-05",
      label: "Recovery programming",
      desc: "Determination and implementation of recovery programme based on impact assessment.",
      capabilityStakeholders: [],
    },
  ] as ICapability[],
  mainTasks: [
    {
      id: "Goal-01",
      label: "Prevent incidents",
      desc: "Prevent disasters / crisis situations.",
    },
    {
      id: "Goal-02",
      label: "Minimise losses from hazards",
      desc: "Reduce / avoid losses from hazards.",
    },
    {
      id: "Goal-03",
      label: "Help victims",
      desc: "Assure prompt effective assistance to victims",
    },
    {
      id: "Goal-04",
      label: "Adequate recovery",
      desc: "Achieve rapid and effective recovery",
    },
  ],
  taskScale: [
    { id: "Imp-1", color: "#d3d3d3", label: "None/Very low" },
    { id: "Imp-2", color: "#d2f550", label: "Low" },
    { id: "Imp-3", color: "#ffff00", label: "Medium" },
    { id: "Imp-4", color: "#ffac1c", label: "Quite high" },
    { id: "Imp-5", color: "#ff0000", label: "Very high" },
  ],
  performanceAspects: [
    {
      id: "PA-1",
      label: "Effectiveness",
      desc: "- Quality of the results\n- Timeliness\n- Endurance",
    },
    {
      id: "PA-2",
      label: "Safety/Security of professionals",
      desc: "Physical and mental safety of involved personnel",
    },
    {
      id: "PA-3",
      label: "Efficiency",
      desc: "Relation between costs and results",
    },
  ],
  performanceScale: [
    { id: "PSc-1", color: "#ff0000", label: "Poor" },
    { id: "PSc-2", color: "#ffac1c", label: "Unsatisfactory" },
    { id: "PSc-3", color: "#ffff00", label: "Moderate" },
    { id: "PSc-4", color: "#d2f550", label: "Satisfactory" },
    { id: "PSc-5", color: "#2d8c0a", label: "Good" },
  ],
  mainGaps: [
    {
      id: "Nat-01",
      label: "Technological",
      desc: "E.g., Sensing Technologies, Command and control, communications and coordination, ICT",
    },
    {
      id: "Nat-02",
      label: "Human",
      desc: "E.g., Amount of personnel, Competence of personnel, Training and education",
    },
    {
      id: "Nat-03",
      label: "Organizational",
      desc: "E.g., Procedures, Organizational structure, Financial Aspects, Agreements",
    },
    {
      id: "Nat-04",
      label: "Regulatory",
      desc: "E.g., Legal Aspects, Formal Standardization aspects",
    },
  ],
  gapScale: [
    { id: "Kn-01", label: "Unknown", color: "#d3d3d3" },
    { id: "Kn-02", label: "No", color: "#000000" },
    { id: "Kn-03", label: "Yes", color: "#0000ff" },
  ],
  assessmentScale: [
    { id: "ASc-01", color: "#2d8c0a", label: "Very low" },
    { id: "ASc-02", color: "#a4c62a", label: "Low" },
    { id: "ASc-03", color: "#ffff00", label: "Moderate" },
    { id: "ASc-04", color: "#ffac1c", label: "High" },
    { id: "ASc-05", color: "#ff0000", label: "Very high" },
  ],
  assessmentTable: [
    { rowId: "Imp-1", colId: "PSc-1", optionId: "ASc-03" },
    { rowId: "Imp-1", colId: "PSc-2", optionId: "ASc-03" },
    { rowId: "Imp-1", colId: "PSc-3", optionId: "ASc-02" },
    { rowId: "Imp-1", colId: "PSc-4", optionId: "ASc-02" },
    { rowId: "Imp-1", colId: "PSc-5", optionId: "ASc-01" },
    { rowId: "Imp-2", colId: "PSc-1", optionId: "ASc-04" },
    { rowId: "Imp-2", colId: "PSc-2", optionId: "ASc-03" },
    { rowId: "Imp-2", colId: "PSc-3", optionId: "ASc-03" },
    { rowId: "Imp-2", colId: "PSc-4", optionId: "ASc-02" },
    { rowId: "Imp-2", colId: "PSc-5", optionId: "ASc-01" },
    { rowId: "Imp-3", colId: "PSc-1", optionId: "ASc-04" },
    { rowId: "Imp-3", colId: "PSc-2", optionId: "ASc-04" },
    { rowId: "Imp-3", colId: "PSc-3", optionId: "ASc-03" },
    { rowId: "Imp-3", colId: "PSc-4", optionId: "ASc-03" },
    { rowId: "Imp-3", colId: "PSc-5", optionId: "ASc-01" },
    { rowId: "Imp-4", colId: "PSc-1", optionId: "ASc-05" },
    { rowId: "Imp-4", colId: "PSc-2", optionId: "ASc-04" },
    { rowId: "Imp-4", colId: "PSc-3", optionId: "ASc-04" },
    { rowId: "Imp-4", colId: "PSc-4", optionId: "ASc-03" },
    { rowId: "Imp-4", colId: "PSc-5", optionId: "ASc-01" },
    { rowId: "Imp-5", colId: "PSc-1", optionId: "ASc-05" },
    { rowId: "Imp-5", colId: "PSc-2", optionId: "ASc-05" },
    { rowId: "Imp-5", colId: "PSc-3", optionId: "ASc-04" },
    { rowId: "Imp-5", colId: "PSc-4", optionId: "ASc-04" },
    { rowId: "Imp-5", colId: "PSc-5", optionId: "ASc-01" },
  ],
  hazardTypes: [],
  selectedHazardIds: [],
  solutions: [],
  roadmapItems: [],
  lexicon,
};

export function defaultCapabilityModel(): CapabilityModel {
  return {
    version: 0,
    data: JSON.parse(JSON.stringify(DEFAULT_MODEL_DATA)),
  };
}
