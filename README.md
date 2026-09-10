# ai-agents

A small team of specialist AI agents — built on the Claude API — that collaborate to design and build a full-stack application from a single project brief.

See [`developers-site/`](./developers-site) for **developers.mmvietnam.com** — a Node.js/Express + React developer portal with app/web development guides and the internal REST API Standard (with a live example implementation).

## How it works

```
                 ┌──────────────┐
   brief ──────▶ │ Orchestrator │  breaks the brief into a task plan
                 └──────┬───────┘  (submit_plan tool → structured JSON)
                        │
        topologically sorts tasks by dependsOn
                        │
        ┌───────────────┼────────────────────────┐
        ▼               ▼                        ▼
   ┌─────────┐    ┌───────────┐   ┌───────────┐  ...  each task run by
   │ database│ →  │  backend  │ → │ frontend  │        the matching
   └─────────┘    └───────────┘   └───────────┘        specialist agent,
        also: devops, qa                               writing files into
                        │                               a shared workspace/
                        ▼
                 ┌──────────────┐
                 │   Reviewer   │  inspects the generated project,
                 └──────────────┘  writes workspace/BUILD_REPORT.md
```

Every agent is a `Agent` instance (`src/agents/Agent.ts`) wrapping the Claude Messages API with a tool-use loop:

- **Specialist agents** (`backend`, `frontend`, `database`, `devops`, `qa`) get `list_files` / `read_file` / `write_file` tools scoped to the shared `workspace/` directory (plus an optional `run_command` tool, gated behind `--allow-shell`) and loop freely until they stop calling tools, at which point their final text is treated as a task summary.
- **Orchestrator** and **Reviewer** use `runStructured()`, which keeps the loop going until the model calls a specific "output" tool (`submit_plan` / `submit_review`), guaranteeing a parseable structured result instead of free-form text.

Tasks run in dependency order (`src/orchestration/topoSort.ts`) so, e.g., the backend task sees the database schema before it needs it, and the frontend task sees the backend's real routes before wiring API calls.

## Setup

```bash
npm install
cp .env.example .env   # then put your ANTHROPIC_API_KEY in .env
```

## Usage

```bash
npm run dev -- "A todo list app with user accounts, a REST API, and a Postgres database"
```

This generates the project into `./workspace` (change with `-o, --workspace <dir>`) and writes `workspace/BUILD_REPORT.md` with the plan, per-task summaries, and the reviewer's verdict.

Build and run the compiled CLI instead of the dev (tsx) loop:

```bash
npm run build
npm start -- "A blog with markdown posts and comments" -o ./my-blog
```

### Letting agents run shell commands

By default agents can only read/write files. Pass `--allow-shell` to also give them a `run_command` tool (allowlisted to `npm`, `npx`, `node`, `git`, `mkdir`, run with a 120s timeout inside the workspace directory) so e.g. the devops/qa agents can actually run `npm install` or `npm test`:

```bash
npm run dev -- "..." --allow-shell
```

This executes real commands on your machine inside `workspace/` — only enable it if you're comfortable with that.

## Project layout

```
src/
  agents/
    Agent.ts            base Claude tool-use loop (run / runStructured)
    prompts.ts           system prompts per role
    factory.ts            builds a configured Agent per role
  tools/
    fileTools.ts          list_files / read_file / write_file, sandboxed to workspace/
    shellTool.ts           run_command, allowlisted binaries, opt-in
    structuredTools.ts      submit_plan / submit_review tool schemas
  orchestration/
    types.ts               Plan / PlanTask / Review / TaskResult
    topoSort.ts              orders tasks by dependsOn
    promptBuilder.ts          builds each specialist's task prompt
    Orchestrator.ts            plan → execute → review
  config.ts               model name / token limits (env-overridable)
  index.ts                 CLI entrypoint (commander)
```

## Configuration

| Env var | Purpose | Default |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | required, your Claude API key | — |
| `ANTHROPIC_MODEL` | model used by every agent | `claude-sonnet-5` |

## Notes / limitations

- This is a from-scratch orchestration framework, not built on the Claude Agent SDK — it talks to the Messages API directly so the plan/execute/review loop is easy to see and modify.
- File tools are sandboxed to the workspace directory (path traversal is rejected); the shell tool is off by default and allowlisted when enabled, but it is not a full sandbox — treat `--allow-shell` as running real commands on your machine.
- The reviewer agent does a single pass and does not currently loop back to re-run tasks automatically when it finds issues; `BUILD_REPORT.md` surfaces what it found so you can address it manually or re-run a task.
