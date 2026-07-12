import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import type { ToolDefinition } from './types.js';

const execFileAsync = promisify(execFile);

/** Binaries agents are permitted to invoke. Deliberately small: no rm, curl, sh, bash, etc. */
const ALLOWED_BINARIES = new Set(['npm', 'npx', 'node', 'git', 'mkdir']);

/**
 * Shell tool, off by default. Only wired in when the CLI is started with --allow-shell,
 * since letting an LLM execute arbitrary commands (even allowlisted ones) is a real risk
 * the operator must opt into explicitly.
 */
export function createShellTool(workspaceRoot: string): ToolDefinition {
  return {
    name: 'run_command',
    description: `Run a shell command inside the project workspace. Only these binaries are permitted: ${[...ALLOWED_BINARIES].join(', ')}. Use this to install dependencies or run tests/builds.`,
    inputSchema: {
      type: 'object',
      properties: {
        command: {
          type: 'string',
          description: 'A single command line, e.g. "npm install" or "npm test"',
        },
      },
      required: ['command'],
    },
    handler: async (input: { command: string }) => {
      const parts = input.command.trim().split(/\s+/);
      const [bin, ...args] = parts;
      if (!bin || !ALLOWED_BINARIES.has(bin)) {
        return `Blocked: "${bin ?? ''}" is not in the allowlist (${[...ALLOWED_BINARIES].join(', ')})`;
      }
      try {
        const { stdout, stderr } = await execFileAsync(bin, args, {
          cwd: workspaceRoot,
          timeout: 120_000,
          maxBuffer: 4 * 1024 * 1024,
        });
        return `${stdout}\n${stderr}`.trim().slice(0, 4000) || '(no output)';
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return `Command failed: ${message}`.slice(0, 4000);
      }
    },
  };
}
