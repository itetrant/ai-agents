import Anthropic from '@anthropic-ai/sdk';
import { Agent } from './Agent.js';
import { ORCHESTRATOR_SYSTEM_PROMPT, REVIEWER_SYSTEM_PROMPT, specialistSystemPrompt } from './prompts.js';
import { createFileTools } from '../tools/fileTools.js';
import { createShellTool } from '../tools/shellTool.js';
import { submitPlanTool } from '../tools/structuredTools.js';
import { submitReviewTool } from '../tools/structuredTools.js';
import type { Role } from '../orchestration/types.js';

export function createOrchestratorAgent(client: Anthropic): Agent {
  return new Agent(
    {
      name: 'orchestrator',
      systemPrompt: ORCHESTRATOR_SYSTEM_PROMPT,
      tools: [submitPlanTool],
      maxTurns: 4,
    },
    client,
  );
}

export function createSpecialistAgent(
  role: Role,
  client: Anthropic,
  workspaceRoot: string,
  allowShell: boolean,
): Agent {
  const tools = [...createFileTools(workspaceRoot)];
  if (allowShell) tools.push(createShellTool(workspaceRoot));

  return new Agent(
    {
      name: role,
      systemPrompt: specialistSystemPrompt(role),
      tools,
      maxTurns: 16,
    },
    client,
  );
}

export function createReviewerAgent(client: Anthropic, workspaceRoot: string): Agent {
  const fileTools = createFileTools(workspaceRoot).filter((t) => t.name !== 'write_file');
  return new Agent(
    {
      name: 'reviewer',
      systemPrompt: REVIEWER_SYSTEM_PROMPT,
      tools: [...fileTools, submitReviewTool],
      maxTurns: 8,
    },
    client,
  );
}
