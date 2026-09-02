# Pull Request Description

## Summary
This change adds a name-based product search to the storefront so shoppers can quickly find items without browsing the entire catalog. It improves product discoverability while preserving the existing cart flow and keeps the implementation aligned with the lightweight Spring Boot + static UI architecture already used by the app.

## Changes Made
- `src/main/resources/static/index.html`
  - Added a visible search field to the storefront.
  - Wired the input to filter the rendered product cards as the shopper types.
  - Restored the full product list when the field is empty.
- `src/main/java/com/example/shop/controller/ProductController.java`
  - Added optional `name` query support to `GET /api/products`.
  - Centralized request filtering through the backend search service.
- `src/main/java/com/example/shop/service/ProductSearchService.java`
  - Implemented case-insensitive, trimmed matching against product names only.
- `src/test/java/com/example/shop/service/ProductSearchServiceTest.java`
  - Added unit tests for empty, match, no-match, and null input scenarios.
- `src/test/java/com/example/shop/controller/ProductControllerTest.java`
  - Added controller tests for default and filtered catalog responses.
- `tests/product-search.spec.js`
  - Added Playwright UI verification covering the acceptance criteria.
- `playwright.config.js`
  - Added Playwright configuration for storefront verification.
- `pom.xml`
  - Added Spring Boot test dependency for automated Java test support.

## Test Evidence
From `src/docs/verification-report.md`:

- Unit Tests: 6 total, 6 passed, 0 failed, 0 skipped
- Playwright Tests: 4 total, 4 passed, 0 failed, 0 skipped
- Application Health: `GET /` and `GET /api/products` both returned HTTP 200
- Requirement Verified: Yes

## Reviewer Checklist
- [ ] Search box is visible and labeled clearly
- [ ] Products are filtered while typing
- [ ] Matching is case-insensitive
- [ ] Empty search shows the full catalog
- [ ] No-match search returns an empty result set without breaking the page
- [ ] Cart functionality remains intact
- [ ] Automated tests cover happy path, negative path, and boundary cases
- [ ] App starts successfully and responds on the expected endpoints

## Notes
This PR draft was prepared manually because the repository was not explicitly requested to be pushed or opened as a GitHub pull request during this session.
