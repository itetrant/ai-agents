import type { ToolDefinition } from './types.js';

/**
 * "Structured output" tools: the orchestrator/reviewer never really needs their handler
 * run — Agent.runStructured() intercepts the tool_use block itself and returns its input
 * directly. The handler exists only to satisfy ToolDefinition and is never invoked.
 */

export const SUBMIT_PLAN_TOOL_NAME = 'submit_plan';

export const submitPlanTool: ToolDefinition = {
  name: SUBMIT_PLAN_TOOL_NAME,
  description:
    'Submit the final implementation plan for the project: a short summary plus an ordered list of tasks assigned to specialist teammates.',
  inputSchema: {
    type: 'object',
    properties: {
      summary: { type: 'string', description: 'One or two sentence summary of the overall plan' },
      tasks: {
        type: 'array',
        description: 'Ordered list of implementation tasks, typically 4-8 items',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Short unique id, e.g. "t1"' },
            role: {
              type: 'string',
              enum: ['backend', 'frontend', 'database', 'devops', 'qa'],
            },
            title: { type: 'string' },
            description: {
              type: 'string',
              description: 'What to build and which files/areas it covers',
            },
            dependsOn: {
              type: 'array',
              items: { type: 'string' },
              description: 'ids of tasks that must finish first (empty array if none)',
            },
          },
          required: ['id', 'role', 'title', 'description', 'dependsOn'],
        },
      },
    },
    required: ['summary', 'tasks'],
  },
  handler: async () => 'ok',
};

export const SUBMIT_REVIEW_TOOL_NAME = 'submit_review';

export const submitReviewTool: ToolDefinition = {
  name: SUBMIT_REVIEW_TOOL_NAME,
  description: 'Submit your final review of the generated project.',
  inputSchema: {
    type: 'object',
    properties: {
      approved: { type: 'boolean', description: 'Whether the project is in an acceptable state' },
      summary: { type: 'string', description: 'A few sentences on the overall state of the project' },
      issues: {
        type: 'array',
        items: { type: 'string' },
        description: 'Concrete follow-up issues or gaps found, if any (empty array if none)',
      },
    },
    required: ['approved', 'summary', 'issues'],
  },
  handler: async () => 'ok',
};
