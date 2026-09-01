---
name: 01-requirements-clarifier
description: 'Converts a user story into a structured requirements document with clarifying questions, assumptions, functional requirements, non-functional requirements, acceptance criteria, and out-of-scope items.'
---

## Goal
Convert the provided user story into `requirements.md`. 

## Inputs needed (ask if missing)
- User story text
- Constraints (stack, timeline, policies)

## Procedure
1) Ask clarifying questions (flows, data, rules, edge cases, NFRs).
2) Wait for answers.
3) Produce requirements.md with:
   - Scope/overview
   - Assumptions
   - Functional requirements (numbered)
   - Non-functional requirements
   - Acceptance criteria (Given/When/Then)
   - Out of scope

## Output
- Final Markdown for requirements.md