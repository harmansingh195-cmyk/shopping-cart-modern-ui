# GitHub Copilot Hooks

This document registers and documents all custom hooks used by GitHub Copilot CLI in this project.

## Hook Registry

### Verify PR Readiness
- **File**: `.github/hooks/scripts/verify-pr.sh`
- **Description**: Ensures all SDLC artifacts exist before creating a pull request
- **Trigger**: Before PR creation
- **Platform**: Cross-platform (bash)

#### Required Artifacts

The following artifacts must exist in either repo root or `docs/` directory:

1. `requirements.md` - Functional and non-functional requirements
2. `architecture.md` - System design and architecture
3. `design-review.md` - Design review findings and recommendations
4. `impl-plan.md` - Implementation tasks with dependencies
5. `verify.md` or `verification-report.md` - Test results and verification evidence

#### Execution

```bash
bash ./.github/hooks/scripts/verify-pr.sh