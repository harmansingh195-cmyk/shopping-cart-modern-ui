---
name: 01-requirements-clarifier
description: 'Converts a user story into a structured requirements document with clarifying questions, assumptions, functional requirements, non-functional requirements, acceptance criteria, and out-of-scope items.'
---

## Purpose
Convert the provided user story into `requirements.md`.

## Inputs needed (ask if missing)
- Jira issue key or Jira issue URL (preferred)
- User story text (fallback when Jira fetch is unavailable)
- Constraints (stack, timeline, policies)

## Procedure
1) **First action (mandatory):** If a Jira key/URL is provided, use the `mcp-atlassian` server to fetch the issue details before asking questions.
2) If Jira fetch fails (missing credentials/server unavailable/permission denied), explicitly state the fetch failed and ask the user to paste the full story + acceptance criteria.
3) Ask clarifying questions (flows, data, rules, edge cases, NFRs).
4) Wait for answers.
5) Produce requirements.md with:
   - Scope/overview
   - Assumptions
   - Functional requirements (numbered)
   - Non-functional requirements
   - Acceptance criteria (Given/When/Then)
   - Out of scope
6) In the output, include a short `Source` note:
   - `Jira: <KEY>` when fetched from Jira, or
   - `User-provided story text` when fallback input was used.

## Output
- Final Markdown for requirements.md