import type { ILabelled } from './capability-model';

export interface IComplianceCheck {
  id: string;
  label: string;
  value?: 'pass' | 'partial' | 'fail' | 'na';
}

export interface IAssessmentQuestion extends ILabelled {
  value?: string;
}

export interface ISolution extends ILabelled {
  url?: string;
  trl?: number; // 1-9
  capabilityIds?: string[]; // linked gaps from Step 2
  compliance?: IComplianceCheck[];
  userNeeds?: IAssessmentQuestion[];
  operationalNeeds?: IAssessmentQuestion[];
  organisationalNeeds?: IAssessmentQuestion[];
  expectedImpact?: IAssessmentQuestion[];
}

export const defaultComplianceChecks: IComplianceCheck[] = [
  { id: 'CC01', label: '(Cyber) Security' },
  { id: 'CC02', label: 'Interoperability' },
  { id: 'CC03', label: 'AI Act' },
  { id: 'CC04', label: 'Community Engagement' },
  { id: 'CC05', label: 'GDPR' },
  { id: 'CC06', label: 'Fundamental Rights' },
  { id: 'CC07', label: 'Sustainable Development Goals' },
  { id: 'CC08', label: 'National level crisis management priorities' },
  { id: 'CC09', label: 'Sector specific standards' },
  { id: 'CC10', label: 'Sector specific laws & regulations' },
];

export const defaultUserNeeds: IAssessmentQuestion[] = [
  { id: 'UN01', label: 'Is the solution easy to use?' },
  { id: 'UN02', label: 'Does the solution likely perform adequately under duress? Including robustness and reliability.' },
  { id: 'UN03', label: 'Is the solution likely to be accepted by users?' },
  { id: 'UN04', label: 'Is the solution likely to support user understandability?' },
  { id: 'UN05', label: 'Is the solution likely to support user explainability?' },
  { id: 'UN06', label: 'Is the solution likely to improve user efficiencies?' },
  { id: 'UN07', label: 'Is the solution likely to improve user effectiveness?' },
  { id: 'UN08', label: 'Is the solution likely to provide added knowledge?' },
  { id: 'UN09', label: 'Is the solution likely to consistently produce positive interventions and/or results?' },
];

export const defaultOperationalNeeds: IAssessmentQuestion[] = [
  { id: 'ON01', label: 'Is the solution likely to require extensive (re-)training?' },
  { id: 'ON02', label: 'Is the solution likely to require excessive maintenance & support?' },
  { id: 'ON03', label: 'Is the solution likely to be compatible with your operating methods/SoP?' },
  { id: 'ON04', label: 'Is the solution interoperable?' },
  { id: 'ON05', label: 'Is the solution likely to be adaptable and transferable across your operating scenarios?' },
  { id: 'ON06', label: 'Is the solution likely to support responder health and safety?' },
  { id: 'ON07', label: 'Is the solution likely to reach the intended target population?' },
  { id: 'ON08', label: 'Is the solution likely to offer improved operational efficiencies?' },
  { id: 'ON09', label: 'Is the solution likely to offer improved operational effectiveness?' },
];

export const defaultOrganisationalNeeds: IAssessmentQuestion[] = [
  { id: 'OG01', label: 'Is the solution likely to have a positive cost-benefit balance?' },
  { id: 'OG02', label: 'Does the solution seem feasible? Including technologically, economically, legally, operationally, and scheduling.' },
  { id: 'OG03', label: 'Is the solution likely to be compatible with your organisational culture?' },
  { id: 'OG04', label: 'Is the solution likely to be compatible with your organisational mandate?' },
  { id: 'OG05', label: 'Is the solution likely to be compatible with the priorities of CM governance?' },
  { id: 'OG06', label: 'Would using the solution support your reputation amongst the public?' },
  { id: 'OG07', label: 'Would using the solution help to improve community relations?' },
];

export const defaultExpectedImpact: IAssessmentQuestion[] = [
  { id: 'EI01', label: 'Will the solution be applied in the context of human healthcare?' },
  { id: 'EI02', label: 'Does the solution involve the processing of personal data?' },
  { id: 'EI03', label: 'Is the solution likely to have a negative impact on the rights & freedoms of individuals and groups? E.g. privacy, dignity, autonomy, solidarity.' },
  { id: 'EI04', label: 'Is the solution likely to have a negative impact in terms of social justice and equality?' },
  { id: 'EI05', label: 'Is the solution likely to have a negative impact on the well-being of individuals or groups?' },
  { id: 'EI06', label: 'Is the solution likely to increase the vulnerability of individuals or groups?' },
  { id: 'EI07', label: 'Is the solution likely to pose potential safety risks?' },
  { id: 'EI08', label: 'Is the solution likely to have a negative impact on the environment?' },
  { id: 'EI09', label: 'Is there SIGNIFICANT uncertainty regarding the legal, ethical, and societal impacts from the use of the solution?' },
];
