import type { ILabelled } from './capability-model';

export interface IRoadmapItem {
  solutionId: string;
  targetDate?: string;
  priority?: 'low' | 'medium' | 'high';
  commitment?: string;
  questions?: ILabelled[];
}
