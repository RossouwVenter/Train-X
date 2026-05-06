---
name: create-agent
description: 'Create new specialized AI agents for the project. Use when: adding a new team member role, spinning up a frontend/backend/QA/DevOps agent, creating a custom agent for a specific task, expanding the team.'
argument-hint: 'Describe the agent role needed (e.g., "frontend developer for React components")'
---

# Create Agent Skill

## When to Use
- The project needs a new specialized role (frontend, backend, QA, etc.)
- A one-off agent is needed for a specific task
- The Manager agent decides to expand the team

## Procedure

1. **Determine the role** — Ask what capability is needed if not clear
2. **Select the archetype** — See [agent templates](./references/agent-templates.md) for ready-made patterns
3. **Customize** — Adjust tools, constraints, and focus for the project's needs
4. **Create the file** — Write to `.github/agents/<name>.agent.md`
5. **Verify** — Confirm frontmatter is valid YAML and description contains trigger phrases

## Rules

- Agent names should be lowercase, hyphenated: `frontend-dev.agent.md`
- Every agent MUST have a `description` with "Use when:" trigger phrases
- Keep tool lists minimal — only what the role actually needs
- Define clear constraints about what the agent should NOT do
- One role per agent — don't create swiss-army agents

## Available Tool Aliases

| Alias | Grants |
|-------|--------|
| `read` | Read file contents |
| `edit` | Edit/create files |
| `search` | Search files and text |
| `execute` | Run shell commands |
| `agent` | Invoke other agents as subagents |
| `web` | Fetch URLs, web search |
| `todo` | Manage task lists |
