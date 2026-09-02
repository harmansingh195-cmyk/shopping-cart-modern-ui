# Implementation Plan

## Overview

Implement product search entirely in the browser against the already loaded product list. The plan keeps the backend unchanged, focuses on small UI and rendering updates, and adds browser-level tests for the required search behavior.

## Assumptions

- Search remains client-side and does not require backend changes.
- The existing `/api/products` response shape is sufficient.
- No database or persistence work is needed.
- The storefront continues to use vanilla JavaScript and static HTML/CSS.

## Task Breakdown

### Task 1: Add search UI structure to the storefront

Description:
Add a search input and a no-results placeholder to the storefront layout in `src/main/resources/static/index.html`.

Priority:
P1

Dependencies:
None

Deliverable:
Search box visible on page load and a dedicated empty-state container for search results.

### Task 2: Implement in-memory prefix filtering

Description:
Add client-side filtering logic that normalizes whitespace, performs case-insensitive prefix matching on product names, and preserves original order.

Priority:
P1

Dependencies:
Task 1

Deliverable:
Typing in the search input filters the loaded products immediately.

### Task 3: Render empty-state and reset states consistently

Description:
Update rendering so empty search input restores all products and no-match searches display the no-results message instead of an empty grid.

Priority:
P1

Dependencies:
Task 2

Deliverable:
Correct visible states for empty input, matching results, and no results.

### Task 4: Harden product rendering against unsafe HTML injection

Description:
Refactor product card rendering to use safe DOM construction or explicit escaping instead of direct string-based HTML insertion for product content.

Priority:
P2

Dependencies:
Task 1

Deliverable:
Product cards render safely even if product content changes in the future.

### Task 5: Add Playwright coverage for search behavior

Description:
Add or update browser automation to verify visible search box, immediate filtering, case-insensitive prefix matching, reset on empty input, and empty-state behavior.

Priority:
P1

Dependencies:
Tasks 1, 2, 3

Deliverable:
Automated UI coverage for the acceptance criteria.

### Task 6: Verify cart interactions still work after search changes

Description:
Confirm add-to-cart and checkout behavior remain unchanged after search rendering updates.

Priority:
P2

Dependencies:
Tasks 2, 3

Deliverable:
Cart behavior continues to work with the updated storefront.

## Dependency Order

1. Add search UI structure to the storefront.
2. Implement in-memory prefix filtering.
3. Render empty-state and reset states consistently.
4. Harden product rendering against unsafe HTML injection.
5. Add Playwright coverage for search behavior.
6. Verify cart interactions still work after search changes.

## Parallel Work Opportunities

- Safe rendering hardening can proceed alongside search-state rendering after the base search UI exists.
- Playwright test implementation can begin once the search UI and filter behavior are defined.

## Blocked Tasks

| Task | Blocked By |
|------|------------|
| Implement in-memory prefix filtering | Add search UI structure to the storefront |
| Render empty-state and reset states consistently | Implement in-memory prefix filtering |
| Harden product rendering against unsafe HTML injection | Add search UI structure to the storefront |
| Add Playwright coverage for search behavior | Add search UI structure to the storefront; Implement in-memory prefix filtering; Render empty-state and reset states consistently |
| Verify cart interactions still work after search changes | Implement in-memory prefix filtering; Render empty-state and reset states consistently |

## Milestones

### Milestone 1: UI foundation

Tasks:

- Add search UI structure to the storefront
- Implement in-memory prefix filtering

### Milestone 2: Behavior completion

Tasks:

- Render empty-state and reset states consistently
- Harden product rendering against unsafe HTML injection

### Milestone 3: Validation

Tasks:

- Add Playwright coverage for search behavior
- Verify cart interactions still work after search changes

## Risks

- Risk: String-based DOM rendering could introduce injection issues if future catalog data becomes untrusted.
  - Mitigation: Use safe DOM APIs or escaping when rendering product content.
- Risk: Search behavior may regress cart UI rendering if the product list render path is changed too broadly.
  - Mitigation: Keep search filtering and cart rendering concerns separate and cover both with browser tests.

## Suggested Implementation Sequence

1. Add the search input and empty-state UI.
2. Implement the client-side filter function.
3. Wire reset and no-results rendering states.
4. Harden product rendering.
5. Add browser automation coverage.
6. Confirm cart behavior remains stable.
