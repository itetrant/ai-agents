import fs from 'node:fs/promises';
import path from 'node:path';
import Anthropic from '@anthropic-ai/sdk';
import { createOrchestratorAgent, createReviewerAgent, createSpecialistAgent } from '../agents/factory.js';
import { SUBMIT_PLAN_TOOL_NAME, SUBMIT_REVIEW_TOOL_NAME } from '../tools/structuredTools.js';
import { logger } from '../utils/logger.js';
import { topoSort } from './topoSort.js';
import { buildTaskPrompt } from './promptBuilder.js';
import type { Plan, Review, TaskResult } from './types.js';

export class Orchestrator {
  constructor(
    private readonly client: Anthropic,
    private readonly workspaceRoot: string,
    private readonly allowShell: boolean,
  ) {}

  async run(brief: string): Promise<void> {
    logger.section('Planning');
    const plan = await this.createPlan(brief);
    logger.info(plan.summary);
    for (const task of plan.tasks) {
      logger.info(`  [${task.id}] (${task.role}) ${task.title}${task.dependsOn.length ? ` <- ${task.dependsOn.join(', ')}` : ''}`);
    }

    const orderedTasks = topoSort(plan.tasks);
    const results: TaskResult[] = [];

    for (const task of orderedTasks) {
      logger.section(`[${task.role}] ${task.title}`);
      const agent = createSpecialistAgent(task.role, this.client, this.workspaceRoot, this.allowShell);
      const prompt = buildTaskPrompt(brief, task, results);
      const { finalText, toolCalls } = await agent.run(prompt);
      logger.info(finalText || '(no summary provided)');
      results.push({ task, summary: finalText || '(no summary provided)', toolCallCount: toolCalls.length });
    }

    logger.section('Review');
    const review = await this.review(brief, plan, results);
    logger.info(`Approved: ${review.approved ? 'yes' : 'no'}`);
    logger.info(review.summary);
    for (const issue of review.issues) logger.info(`  - ${issue}`);

    await this.writeReviewFile(brief, plan, results, review);
    logger.success(`Project generated in ${this.workspaceRoot}`);
  }

  private async createPlan(brief: string): Promise<Plan> {
    const agent = createOrchestratorAgent(this.client);
    const prompt = `Project brief:\n${brief}\n\nCall ${SUBMIT_PLAN_TOOL_NAME} with your implementation plan.`;
    return agent.runStructured<Plan>(prompt, SUBMIT_PLAN_TOOL_NAME);
  }

  private async review(brief: string, plan: Plan, results: TaskResult[]): Promise<Review> {
    const agent = createReviewerAgent(this.client, this.workspaceRoot);
    const prompt = `Project brief: ${brief}

Plan summary: ${plan.summary}

Completed tasks:
${results.map((r) => `- (${r.task.role}) ${r.task.title}: ${r.summary}`).join('\n')}

Inspect the generated project with list_files and read_file, then call ${SUBMIT_REVIEW_TOOL_NAME} with your verdict.`;
    return agent.runStructured<Review>(prompt, SUBMIT_REVIEW_TOOL_NAME);
  }

  private async writeReviewFile(brief: string, plan: Plan, results: TaskResult[], review: Review): Promise<void> {
    const lines = [
      '# AI Agent Team — Build Report',
      '',
      '## Brief',
      brief,
      '',
      '## Plan',
      plan.summary,
      '',
      ...plan.tasks.map((t) => `- [${t.id}] (${t.role}) ${t.title}`),
      '',
      '## Task Summaries',
      ...results.map((r) => `### (${r.task.role}) ${r.task.title}\n${r.summary}`),
      '',
      '## Review',
      `**Approved:** ${review.approved ? 'Yes' : 'No'}`,
      '',
      review.summary,
      '',
      review.issues.length ? `### Open Issues\n${review.issues.map((i) => `- ${i}`).join('\n')}` : 'No outstanding issues.',
      '',
    ];
    await fs.writeFile(path.join(this.workspaceRoot, 'BUILD_REPORT.md'), lines.join('\n'), 'utf8');
  }
}
