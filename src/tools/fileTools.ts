import fs from 'node:fs/promises';
import path from 'node:path';
import type { ToolDefinition } from './types.js';

function resolveSafe(workspaceRoot: string, relativePath: string): string {
  const root = path.resolve(workspaceRoot);
  const target = path.resolve(root, relativePath);
  if (target !== root && !target.startsWith(root + path.sep)) {
    throw new Error(`Path "${relativePath}" escapes the project workspace`);
  }
  return target;
}

async function listRecursive(dir: string, root: string): Promise<string[]> {
  let entries: import('node:fs').Dirent[];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const out: string[] = [];
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await listRecursive(full, root)));
    } else {
      out.push(path.relative(root, full));
    }
  }
  return out;
}

/** File tools scoped to a single workspace directory: agents can never read/write outside it. */
export function createFileTools(workspaceRoot: string): ToolDefinition[] {
  return [
    {
      name: 'write_file',
      description:
        'Create or overwrite a file inside the shared project workspace. Parent directories are created automatically. Always write complete, working file contents.',
      inputSchema: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Relative file path, e.g. backend/src/index.ts',
          },
          content: { type: 'string', description: 'Full file content to write' },
        },
        required: ['path', 'content'],
      },
      handler: async (input: { path: string; content: string }) => {
        const target = resolveSafe(workspaceRoot, input.path);
        await fs.mkdir(path.dirname(target), { recursive: true });
        await fs.writeFile(target, input.content, 'utf8');
        return `Wrote ${Buffer.byteLength(input.content, 'utf8')} bytes to ${input.path}`;
      },
    },
    {
      name: 'read_file',
      description: 'Read the contents of a file inside the shared project workspace.',
      inputSchema: {
        type: 'object',
        properties: { path: { type: 'string' } },
        required: ['path'],
      },
      handler: async (input: { path: string }) => {
        const target = resolveSafe(workspaceRoot, input.path);
        try {
          return await fs.readFile(target, 'utf8');
        } catch {
          return `File not found: ${input.path}`;
        }
      },
    },
    {
      name: 'list_files',
      description: 'List every file currently in the shared project workspace (recursive).',
      inputSchema: { type: 'object', properties: {} },
      handler: async () => {
        const root = path.resolve(workspaceRoot);
        const files = await listRecursive(root, root);
        return files.length ? files.sort().join('\n') : '(workspace is empty)';
      },
    },
  ];
}
