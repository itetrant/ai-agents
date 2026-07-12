#!/usr/bin/env node
import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { Command } from 'commander';
import Anthropic from '@anthropic-ai/sdk';
import { Orchestrator } from './orchestration/Orchestrator.js';
import { logger } from './utils/logger.js';

const program = new Command();

program
  .name('ai-agents')
  .description('A team of specialist AI agents that collaborate to build a full-stack application.')
  .argument('<brief>', 'Description of the application to build')
  .option('-o, --workspace <dir>', 'Output directory for the generated project', './workspace')
  .option('--allow-shell', 'Let agents run npm/npx/node/git/mkdir commands inside the workspace', false)
  .action(async (brief: string, opts: { workspace: string; allowShell: boolean }) => {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('Missing ANTHROPIC_API_KEY. Copy .env.example to .env and set it, or export it in your shell.');
      process.exitCode = 1;
      return;
    }

    const workspaceRoot = path.resolve(process.cwd(), opts.workspace);
    await fs.mkdir(workspaceRoot, { recursive: true });

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const orchestrator = new Orchestrator(client, workspaceRoot, Boolean(opts.allowShell));

    try {
      await orchestrator.run(brief);
    } catch (err) {
      logger.warn(err instanceof Error ? err.message : String(err));
      process.exitCode = 1;
    }
  });

await program.parseAsync();
