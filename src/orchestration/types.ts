export type Role = 'backend' | 'frontend' | 'database' | 'devops' | 'qa';

export interface PlanTask {
  id: string;
  role: Role;
  title: string;
  description: string;
  dependsOn: string[];
}

export interface Plan {
  summary: string;
  tasks: PlanTask[];
}

export interface Review {
  approved: boolean;
  summary: string;
  issues: string[];
}

export interface TaskResult {
  task: PlanTask;
  summary: string;
  toolCallCount: number;
}
