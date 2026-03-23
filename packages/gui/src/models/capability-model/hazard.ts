import type { ILabelled } from './capability-model';

export type HazardCategory = 'natural' | 'technical' | 'attack';

export interface IHazardType extends ILabelled {
  category: HazardCategory;
  selected?: boolean;
  description?: string;
}

export const defaultHazardTypes: IHazardType[] = [
  // Natural hazards
  { id: 'N01', label: 'Earthquake', category: 'natural' },
  { id: 'N02', label: 'Tsunami', category: 'natural' },
  { id: 'N03', label: 'Volcanic eruption', category: 'natural' },
  { id: 'N04', label: 'Landslide / Avalanche', category: 'natural' },
  { id: 'N05', label: 'Flood', category: 'natural' },
  { id: 'N06', label: 'Flash flood', category: 'natural' },
  { id: 'N07', label: 'Storm / Hurricane / Tornado', category: 'natural' },
  { id: 'N08', label: 'Wildfire / Forest fire', category: 'natural' },
  { id: 'N09', label: 'Extreme temperature (heat/cold)', category: 'natural' },
  { id: 'N10', label: 'Drought', category: 'natural' },
  { id: 'N11', label: 'Epidemic / Pandemic', category: 'natural' },
  { id: 'N12', label: 'Animal disease outbreak', category: 'natural' },
  { id: 'N13', label: 'Insect infestation', category: 'natural' },
  // Technical hazards
  { id: 'T01', label: 'Industrial accident (CBRN)', category: 'technical' },
  { id: 'T02', label: 'Nuclear / Radiological incident', category: 'technical' },
  { id: 'T03', label: 'Transportation accident (air)', category: 'technical' },
  { id: 'T04', label: 'Transportation accident (rail)', category: 'technical' },
  { id: 'T05', label: 'Transportation accident (road)', category: 'technical' },
  { id: 'T06', label: 'Transportation accident (maritime)', category: 'technical' },
  { id: 'T07', label: 'Pipeline / Gas explosion', category: 'technical' },
  { id: 'T08', label: 'Building / Structure collapse', category: 'technical' },
  { id: 'T09', label: 'Dam / Levee failure', category: 'technical' },
  { id: 'T10', label: 'Power outage / Grid failure', category: 'technical' },
  { id: 'T11', label: 'Telecommunications failure', category: 'technical' },
  { id: 'T12', label: 'Water supply contamination', category: 'technical' },
  { id: 'T13', label: 'Hazardous material spill', category: 'technical' },
  // Attack / Intentional
  { id: 'A01', label: 'Terrorist attack (explosive)', category: 'attack' },
  { id: 'A02', label: 'Terrorist attack (CBRN)', category: 'attack' },
  { id: 'A03', label: 'Cyber attack', category: 'attack' },
  { id: 'A04', label: 'Active shooter / Armed assault', category: 'attack' },
  { id: 'A05', label: 'Sabotage of critical infrastructure', category: 'attack' },
  { id: 'A06', label: 'Hostage / Kidnapping situation', category: 'attack' },
  { id: 'A07', label: 'Civil unrest / Riots', category: 'attack' },
  { id: 'A08', label: 'Maritime piracy / Hijacking', category: 'attack' },
  { id: 'A09', label: 'Drone attack', category: 'attack' },
  { id: 'A10', label: 'Hybrid threat', category: 'attack' },
  { id: 'A11', label: 'Disinformation campaign', category: 'attack' },
  { id: 'A12', label: 'Supply chain disruption (intentional)', category: 'attack' },
  { id: 'A13', label: 'Arson', category: 'attack' },
];
