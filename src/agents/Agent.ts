import Anthropic from '@anthropic-ai/sdk';
import { DEFAULT_MAX_TOKENS, DEFAULT_MODEL } from '../config.js';
import type { ToolDefinition } from '../tools/types.js';
import { logger } from '../utils/logger.js';

export interface AgentConfig {
  name: string;
  systemPrompt: string;
  tools: ToolDefinition[];
  model?: string;
  maxTurns?: number;
}

export interface ToolCallLog {
  name: string;
  input: unknown;
  result: string;
}

export interface AgentRunResult {
  finalText: string;
  toolCalls: ToolCallLog[];
}

function toAnthropicTool(tool: ToolDefinition): Anthropic.Tool {
  return {
    name: tool.name,
    description: tool.description,
    input_schema: tool.inputSchema as Anthropic.Tool.InputSchema,
  };
}

async function invokeTool(tool: ToolDefinition | undefined, name: string, input: unknown): Promise<string> {
  if (!tool) return `Unknown tool: ${name}`;
  try {
    return await tool.handler(input);
  } catch (err) {
    return `Tool error: ${err instanceof Error ? err.message : String(err)}`;
  }
}

/**
 * A single Claude-backed agent with a fixed system prompt and tool set. Two modes:
 *  - run(): a free-form tool-use loop that ends once the model replies without tool calls.
 *    Used for specialist agents doing open-ended implementation work.
 *  - runStructured(): same loop, but keeps going (nudging the model if needed) until it
 *    calls one specific "output" tool, whose input is returned directly. Used for the
 *    orchestrator's plan and the reviewer's verdict, so we get reliable structured data
 *    instead of parsing free-form text.
 */
export class Agent {
  constructor(private readonly config: AgentConfig, private readonly client: Anthropic) {}

  async run(userMessage: string): Promise<AgentRunResult> {
    const messages: Anthropic.MessageParam[] = [{ role: 'user', content: userMessage }];
    const toolCalls: ToolCallLog[] = [];
    const maxTurns = this.config.maxTurns ?? 12;

    for (let turn = 0; turn < maxTurns; turn++) {
      const response = await this.client.messages.create({
        model: this.config.model ?? DEFAULT_MODEL,
        max_tokens: DEFAULT_MAX_TOKENS,
        system: this.config.systemPrompt,
        tools: this.config.tools.map(toAnthropicTool),
        messages,
      });
      messages.push({ role: 'assistant', content: response.content });

      const toolUses = response.content.filter(
        (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use',
      );

      if (toolUses.length === 0) {
        const finalText = response.content
          .filter((block): block is Anthropic.TextBlock => block.type === 'text')
          .map((block) => block.text)
          .join('\n')
          .trim();
        return { finalText, toolCalls };
      }

      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const use of toolUses) {
        const tool = this.config.tools.find((t) => t.name === use.name);
        logger.tool(this.config.name, use.name, use.input);
        const result = await invokeTool(tool, use.name, use.input);
        toolCalls.push({ name: use.name, input: use.input, result });
        toolResults.push({ type: 'tool_result', tool_use_id: use.id, content: result });
      }
      messages.push({ role: 'user', content: toolResults });
    }

    return { finalText: '(max turns reached without a final answer)', toolCalls };
  }

  async runStructured<T = unknown>(userMessage: string, outputToolName: string): Promise<T> {
    const messages: Anthropic.MessageParam[] = [{ role: 'user', content: userMessage }];
    const maxTurns = this.config.maxTurns ?? 8;

    for (let turn = 0; turn < maxTurns; turn++) {
      const forceOutput = turn === maxTurns - 1;
      const response = await this.client.messages.create({
        model: this.config.model ?? DEFAULT_MODEL,
        max_tokens: DEFAULT_MAX_TOKENS,
        system: this.config.systemPrompt,
        tools: this.config.tools.map(toAnthropicTool),
        tool_choice: forceOutput ? { type: 'tool', name: outputToolName } : { type: 'auto' },
        messages,
      });
      messages.push({ role: 'assistant', content: response.content });

      const output = response.content.find(
        (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use' && block.name === outputToolName,
      );
      if (output) return output.input as T;

      const toolUses = response.content.filter(
        (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use',
      );

      if (toolUses.length === 0) {
        messages.push({
          role: 'user',
          content: `Please call the ${outputToolName} tool now with your final answer.`,
        });
        continue;
      }

      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const use of toolUses) {
        const tool = this.config.tools.find((t) => t.name === use.name);
        logger.tool(this.config.name, use.name, use.input);
        const result = await invokeTool(tool, use.name, use.input);
        toolResults.push({ type: 'tool_result', tool_use_id: use.id, content: result });
      }
      messages.push({ role: 'user', content: toolResults });
    }

    throw new Error(`${this.config.name} did not call ${outputToolName} within ${maxTurns} turns`);
  }
}
