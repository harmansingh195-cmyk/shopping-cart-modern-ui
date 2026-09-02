# Copilot Instructions

## Project context
- This repository is a Spring Boot 3.3.5 shopping cart demo using Java 17+ and Maven.
- The app serves a product catalog through REST endpoints and renders a modern storefront UI in the browser using plain HTML/CSS/JavaScript.
- Use the `src/docs` folder for generated SDLC artifacts such as `requirements.md`, `architecture.md`, `design-review.md`, `impl-plan.md`, `verification-report.md`, and `review-report.md`.

## Repository rules
- Keep changes small, focused, and reviewable.
- Prefer the simplest implementation that satisfies the requirement.
- Validate inputs at boundaries and handle errors consistently.
- Avoid unnecessary dependencies or framework churn.
- Do not add secrets, credentials, or sensitive configuration values to the repo.
- Update SDLC documentation when requirements, architecture, or implementation decisions change.
- Prefer existing project patterns over introducing new structure or abstractions.

## Coding expectations
- Maintain a clear separation between backend API behavior and frontend UI logic.
- Keep UI changes in the frontend assets that already serve the storefront; do not add overly complex front-end frameworks unless the requirement explicitly demands them.
- Prefer testable code and add automated tests for non-trivial logic and API behavior.
- If a feature changes behavior, update the relevant documentation and artifacts in `src/docs`.

## SDLC guidance
- Use the repository skills for the structured SDLC workflow, one phase at a time.
- Keep skill usage scoped to the active phase; do not jump ahead to implementation, verification, or PR steps before the required artifacts and approvals are complete.
- Treat skills as workflow helpers rather than universal coding rules; project-wide standards belong in this file.

## Output preferences
- Provide Markdown ready to commit for docs.
- Provide code changes as diffs or full files when asked.
- When creating docs, use concise, implementation-ready language and include assumptions, trade-offs, and validation evidence.
- If a required external dependency or permission is unavailable, state the limitation clearly and continue with the safest fallback.