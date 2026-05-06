# TrainX 2.0 — Project Guidelines

## Agent Workflow

This project uses a **Manager agent** that orchestrates all development work. The Manager:

- Owns the sprint plan and PROJECT_BRIEF.md
- Creates specialized agents on demand in `.github/agents/`
- Never writes application code directly — delegates to sub-agents
- Tracks progress in `docs/sprint-N/` directories

## Agent Architecture

```
┌─────────────────────────────────┐
│  @Manager — Plans, coordinates  │
│  Creates agents, tracks sprints │
│  NEVER writes app code          │
└──────────────┬──────────────────┘
               │ Creates & delegates to
      ┌────────┼────────┬─────────┐
      ▼        ▼        ▼         ▼
  Frontend  Backend    QA      Others
  (on       (on        (on     (created
  demand)   demand)    demand)  as needed)
```

## Conventions

- **One agent per role** — keep agents focused with minimal tools
- **Sprint docs** live in `docs/sprint-N/` (plan.md, progress.md, done.md)
- **Decisions** are logged in `docs/decisions.md`
- **PROJECT_BRIEF.md** at the root is the single source of truth
- **Secrets** go in environment variables only, never in code

## Branch Strategy

- `main` — stable, production-ready
- `feature/sprint-N` — development branch per sprint
- `feature/qa-N` — QA testing branch per sprint
