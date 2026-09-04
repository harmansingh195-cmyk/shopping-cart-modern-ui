# Implementation Plan: EPMCDMETST-62766

## Goal and scope

Implement the approved minimal client-side search feature for the storefront in the existing Spring Boot static page.

This story adds a search input above the product grid so shoppers can instantly filter the products already loaded in memory by product name. The feature is intentionally limited to the existing plain HTML/CSS/JS storefront implementation in `src/main/resources/static/index.html`.

In scope:
- Add a search input above the product grid.
- Filter the already-loaded `products` array on every keystroke.
- Use case-insensitive prefix matching on `product.name` after trimming whitespace.
- Treat whitespace-only input as empty / no filter.
- Show `No products found` when zero products match.
- Preserve original product order.
- Keep the `Add To Cart` behavior unchanged.
- Keep the implementation within the current inline JS/static-page approach.

Out of scope:
- Backend changes or API contract changes.
- New frameworks, libraries, or dependencies.
- Debounce/throttle.
- Substring matching.
- Accessibility work (ARIA, keyboard navigation guarantees, screen reader labeling).
- Automated test authoring.

## Dependencies / prerequisites

- Approved requirements: `src/docs/requirements.md`.
- Approved architecture: `src/docs/architecture.md`.
- Existing application structure confirmed:
  - Spring Boot app with static storefront at `src/main/resources/static/index.html`.
  - `ProductController` exposes `GET /api/products` in `src/main/java/com/example/shop/controller/ProductController.java`.
  - Product catalog is fetched once on page load and stored in the in-memory `products` array.
- Current client-side rendering pattern is inline JS inside `index.html` and already renders product cards into the `#products` container.
- No backend model, controller, or API contract changes are required by design; the search logic operates entirely against the already-fetched list.
- No new frameworks/dependencies are introduced; this is a minimal change to the existing static page.

## Proposed tasks in dependency order

### Milestone 1: Confirm the static storefront extension point (P1)

1. P1 — Confirm the current DOM and JS structure in `index.html`
   - Review the existing `fetch('/api/products')` flow and the product card rendering logic.
   - Confirm the product grid container and the insertion point for the search input above it.
   - Confirm that the cart logic remains independent from the product-grid render flow.
   - Dependency: approved requirements and architecture.
   - Parallelism: None meaningful; same file and same render path.

2. P1 — Define the derived filter behavior in the existing inline script
   - Define the search term normalization rule: trim whitespace, lowercase, then compare against `product.name` using a case-insensitive prefix match.
   - Confirm that whitespace-only input is treated as an empty search term (show all products).
   - Confirm that no extra HTTP request is triggered while typing.
   - Dependency: Task 1.

### Milestone 2: Add search UI and render refactor (P1)

3. P1 — Insert the search input above the product grid
   - Add the HTML input above the `.grid` container, following the existing inline CSS conventions already used in `index.html`.
   - Keep the element basic and consistent with the page’s current style approach; no new framework or library required.
   - Dependency: Task 2.

4. P1 — Extract or centralize product rendering for reuse
   - Refactor the current `fetch(...).then(...)` card generation into a reusable render helper that accepts a list to render.
   - Preserve the same HTML structure and `Add To Cart` behavior for each visible product card.
   - Ensure the function can be called both initially after fetch and again after filtering.
   - Dependency: Task 1.

5. P1 — Add the prefix-match helper and input event handler
   - Implement a helper that trims the raw value, converts to lowercase, and checks `product.name.toLowerCase().startsWith(term)`.
   - Attach a native `input` listener to the search field.
   - On every keystroke, compute the filtered subset from the existing `products` array and pass it to the render helper.
   - Ensure no debounce, throttling, or network call is added.
   - Dependency: Tasks 3 and 4.

### Milestone 3: Empty state and final integration (P1)

6. P1 — Implement the no-results state
   - If the trimmed search term is non-empty and the filtered array is empty, render a single user-facing `No products found` message instead of product cards.
   - Ensure the full catalog is restored when the search term becomes empty/whitespace-only.
   - Preserve original order in the unfiltered list and in every filtered result set.
   - Dependency: Tasks 4 and 5.

7. P1 — Final integration review of storefront behavior
   - Check that the cart continues to use the current `add(id)` logic without regression.
   - Confirm that only visible products are rendered and no extra request is triggered by input events.
   - Confirm that product order remains unchanged for both full catalog and filtered catalog.
   - Dependency: Task 6.

### Milestone 4: Story closure / handoff (P2)

8. P2 — Documentation and scope confirmation
   - Ensure `src/docs/impl-plan.md` is recorded as the implementation plan for this story.
   - Explicitly note that the story is limited to the current storefront and does not include backend or testing work.
   - Dependency: Task 7.

## Priority and blocked-task notes

- P1 tasks are required to complete the story and are the main implementation path.
- No P3/P4 tasks are required for this minimal feature because the story is intentionally constrained to a single static page and no backend/test scope.
- Blocked tasks: None in the repo-level sense, because the work is contained to a single file and approved architecture explicitly removes backend and test workload.
- Parallel work: Minimal; this is a single-file implementation with one shared render path. The browser DOM/UI updates and JS logic are tightly coupled, so there is no meaningful parallel implementation branch.

## Risk / mitigation notes

- Risk: Accidental backend/API change by adding server-side filtering or new endpoints.
  - Mitigation: Keep all filtering in the browser against the already-fetched `products` array; explicitly avoid `fetch` in the input handler.

- Risk: Inconsistent product order after filtering.
  - Mitigation: Filter the existing `products` array without re-sorting or reordering; preserve the original array order.

- Risk: Empty-state logic incorrectly firing for whitespace-only input.
  - Mitigation: Normalize input via `trim()` first; if the result is empty, treat it as no filter and render the full list.

- Risk: Substring or contains matching being implemented accidentally.
  - Mitigation: Use `startsWith()` only after lowercasing both the product name and the trimmed search term; do not use `.includes()` or regex matching.

- Risk: Unintended regression in cart behavior.
  - Mitigation: Keep `add(id)`, `render()` (cart render), and `checkout()` untouched; only the visible product grid output changes.

- Risk: New dependency or framework introduction.
  - Mitigation: Use only the current static HTML/CSS/inline JS pattern; no bundler, framework, or package installation.

## Validation checklist referencing acceptance criteria

The implementation should be validated against the approved Acceptance Criteria from `src/docs/requirements.md` without creating automated tests as part of this story.

- AC1 — Prefix match narrows results
  - The filtered list should include products whose names start with the trimmed, case-insensitive search term.

- AC2 — Non-prefix substring does not match
  - A term like `oes` should not match `Shoes` when the name comparison is limited to the start of the string.

- AC3 — Instant filtering, no debounce
  - The grid should update on every input event with no delay or throttling.

- AC4 — No results state
  - When no product names start with the trimmed input, render `No products found` and do not show product cards.

- AC5 — Clearing search restores full grid
  - Clearing the field should restore the full product list in original order.

- AC6 — Whitespace-only input treated as empty
  - A value such as `"   "` should be treated as empty and show the full catalog.

- AC7 — Leading/trailing whitespace trimmed
  - Input values like `"  sh"` or `"sh  "` should behave the same as `"sh"`.

- AC8 — Case-insensitivity
  - `SH`, `sh`, and `Sh` should all match the same product names.

- AC9 — No new network calls
  - Typing in the search box must not fire any new HTTP requests; filtering should use the already-loaded `products` array only.

- AC10 — Cart behavior unaffected
  - Add-to-cart on visible product cards should continue to work exactly as before.

Additional requirement checks:
- FR1 / FR2 / FR3 / FR4 / FR5 / FR6 / FR7 are satisfied by the same in-memory filter/render workflow.
- NFR1 / NFR2 / NFR3 / NFR4 / NFR5 are preserved by keeping work limited to `index.html` and not adding new frameworks, network requests, or accessibility work.

## Output artifacts and expected files touched

Expected files touched for this story:
- `src/main/resources/static/index.html`
- `src/docs/impl-plan.md`

Expected code impact: only the static storefront page is modified. No backend Java files are expected to change.

Files intentionally not expected to change:
- `src/main/java/com/example/shop/controller/ProductController.java`
- `src/main/java/com/example/shop/model/Product.java`
- Any other Spring Boot backend or configuration classes
- Any new frontend framework, bundle, or dependency file

Explicit statement: no backend code or API contract changes are required, and no new frameworks or dependencies are introduced.

## Summary

This story is a focused, minimal client-side enhancement to the storefront’s existing static page. The implementation remains in `index.html`, reuses the current product fetch and render flow, and adds filtering only on the in-memory `products` array. No backend work, no contract changes, and no automation/test authoring are in scope.

Implementation should start only after this plan is approved, and no implementation work is to begin before approval.
