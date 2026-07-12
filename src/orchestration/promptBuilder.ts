import type { PlanTask, TaskResult } from './types.js';

export function buildTaskPrompt(brief: string, task: PlanTask, priorResults: TaskResult[]): string {
  const priorSummary =
    priorResults.length > 0
      ? priorResults.map((r) => `- (${r.task.role}) ${r.task.title}: ${r.summary}`).join('\n')
      : '(nothing yet — you may be one of the first tasks to run)';

  return `Project brief: ${brief}

Your assigned task:
- Title: ${task.title}
- Description: ${task.description}

Work teammates have already completed:
${priorSummary}

Use list_files and read_file first to see what already exists in the shared workspace, then use write_file to create or update everything this task needs. Finish with a short plain-text summary of what you built.`;
}
