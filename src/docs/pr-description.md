# Add storefront product search box (EPMCDMETST-62766)

## Summary

Adds a client-side product search box to the storefront (`index.html`) that filters the existing in-memory `products` array by case-insensitive, prefix-only name match on every keystroke, showing a "No products found" empty state when nothing matches. This closes a gap where customers had no way to narrow a growing product catalog, and it required no new backend endpoints, no new network calls, and no changes to cart/checkout logic. The feature is fully covered by unit/structural tests and a new Playwright end-to-end suite, all passing.

## Changes Made

- `src/main/resources/static/index.html`
  - Added `#search` input and `renderProducts(list)` / `matches(product, rawTerm)` helpers.
  - Search filters on `input` events; trims and lowercases the term; empty/whitespace-only term shows all products; prefix match only (`startsWith`, not `includes`).
  - `add`/`render`/`checkout` cart functions left byte-for-byte unchanged.
- `pom.xml`
  - Added `spring-boot-starter-test` (test scope) to support the new unit tests.
- `src/test/java/com/example/shop/controller/ProductControllerTest.java` (new)
  - Pins the unchanged `GET /api/products` contract (shape/order).
- `src/test/java/com/example/shop/staticpage/StaticSearchPageTest.java` (new)
  - 13 structural/static-markup assertions over `index.html` (search input present/positioned, prefix-only algorithm, trim behavior, no debounce, single `fetch`, cart functions unchanged).
- `e2e/` (new Playwright project)
  - `playwright.config.js`, `package.json`, `package-lock.json`, `.gitignore`
  - `tests/product-search.spec.js` — 11 real-browser tests against `mvn spring-boot:run` on `localhost:8080`.
- `src/docs/` (new SDLC artifacts)
  - `requirements.md`, `architecture.md`, `design-review.md`, `impl-plan.md`, `review-report.md`, `verification-report.md`
- `.github/agents/sdlc-agent.agent.md`, `.github/hooks/sdlc-hitl.json`, `.github/hooks/scripts/guard_docs.py`
  - Minor SDLC tooling fixes (review-loop note, PowerShell command fix for the doc-gate hook, hardened target-path extraction).

## Test Evidence

_(from `src/docs/verification-report.md`)_

**Unit Test Results** (`mvn test`)

| Metric | Count |
|---|---|
| Total | 14 |
| Passed | 14 |
| Failed | 0 |
| Skipped | 0 |

- `ProductControllerTest`: 1/1 passed
- `StaticSearchPageTest`: 13/13 passed
- Build result: `BUILD SUCCESS`

**Playwright Test Results** (`npx playwright test`, Chromium, against `mvn spring-boot:run` on `localhost:8080`)

| Metric | Count |
|---|---|
| Total | 11 |
| Passed | 11 |
| Failed | 0 |
| Skipped | 0 |

Coverage includes positive (AC1, AC3, AC5, AC7, AC8, AC10), negative (AC2, AC4), and boundary (AC6, AC9) scenarios, plus a FR1 DOM-order check.

**Application Health Check**

- ✅ `mvn spring-boot:run` started cleanly on port 8080 in ~4s, no `ERROR`/`WARN` log entries during startup or the full Playwright run.
- `GET /` → `200 OK` (serves `index.html`)
- `GET /api/products` → `200 OK` (4-item JSON catalog with `id`, `name`, `price`, `image`)

**Review Outcome** (from `src/docs/review-report.md`)

- ✅ **Ready for PR** — no High priority findings; all FR/NFR/AC items correctly implemented and covered by passing automated tests.
- One Medium-priority tooling nit noted (see Known Follow-ups below); does not block merge per the review's rationale.

## Known Follow-ups (non-blocking, from review-report.md)

- `e2e/package.json`'s `scripts.test` is still the npm-init placeholder and does not invoke Playwright; recommend updating to `"test": "playwright test"` before/after merge.
- Consider adding a `webServer` entry to `e2e/playwright.config.js` before wiring the suite into CI (app currently must be started manually).
- Pre-existing, unchanged-by-this-story items carried forward as backlog hygiene: unescaped `innerHTML` templating (no new attack surface — catalog is still developer-controlled) and an empty-catalog empty-state edge case (currently unreachable since the catalog is hardcoded and never empty).

## Reviewer Checklist

- [ ] Search filters products by prefix match only, case-insensitively (not substring/`includes`)
- [ ] Empty or whitespace-only search term shows the full, unfiltered product list
- [ ] "No products found" message appears only when a non-empty term matches nothing
- [ ] No new network requests are triggered by typing in the search box (single initial `fetch` only)
- [ ] Cart `add`/`render` and `checkout` behavior is unchanged, including on a filtered grid
- [ ] `mvn test` passes locally (14/14)
- [ ] `npx playwright test` passes locally in `e2e/` against a running app (11/11)
- [ ] Confirm the Medium-priority `e2e/package.json` `test` script gap is acceptable to leave as a fast-follow
