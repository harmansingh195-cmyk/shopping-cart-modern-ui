# Requirements: Product Search Box

## User Story

As a shopper browsing the Modern Shopping Cart storefront,
I want to type into a search box above the product grid,
So that I can quickly narrow the displayed products down to those whose name starts with what I typed.

## Source

- Jira: [EPMCDMETST-62766](https://jiraeu.epam.com/browse/EPMCDMETST-62766) — "As a shopper, I want to search products by name so that I can quickly find products." Requirements were elaborated from this story via clarifying-question answers below, based on the existing codebase (`src/main/resources/static/index.html`, `com.example.shop.model.Product`, `com.example.shop.controller.ProductController`).

## Clarifying Questions & Answers

| # | Question | Answer |
|---|----------|--------|
| 1 | Where should search execute — client or server? | Client-side filtering only. JavaScript filters the already-loaded `products` array in memory. No new or modified API call. |
| 2 | Should typing be debounced? | No. Filtering happens instantly on every keystroke. |
| 3 | What fields should be matched? | Name only. Description/category are out of scope — those fields do not exist on the `Product` model (`id`, `name`, `price`, `image`). |
| 4 | Substring or prefix match? | Case-insensitive **prefix** match only — the product name must start with the typed text. Substring/contains matching is not implemented. |
| 5 | What happens when there are zero matches? | Display a "No products found" message; the product grid shows no cards. |
| 6 | Where is the search box placed in the UI? | Above the product grid. |
| 7 | How is whitespace handled? | Leading/trailing whitespace is trimmed from the input. Whitespace-only input is treated as an empty search, showing all products. |
| 8 | Is accessibility (ARIA, keyboard nav, screen reader labeling) in scope? | Out of scope for this story. |
| 9 | Are automated tests part of this story? | Out of scope / deferred. No test-writing tasks belong to this story; a later verification phase may still validate behavior manually or via tests it introduces independently. |

## Assumptions

- A1: The full product catalog is already fetched once into the client-side `products` array via the existing `GET /api/products` call on page load; this story does not change that fetch or add pagination/lazy-loading.
- A2: The number of products is small enough that in-memory client-side filtering has no noticeable performance impact (no virtualization or indexing needed).
- A3: "Starts with" comparison is performed on the product `name` field only, case-insensitively (e.g., `"sh"` matches `"Shoes"` but not `"Sunglasses"` beyond the literal prefix, and does not match `"Running Shoes"` since the match must be at the start of the string).
- A4: The search box is a single plain text input (no filters, dropdowns, or category chips).
- A5: Clearing the search box (empty or whitespace-only) restores the full, unfiltered product grid.
- A6: The cart and checkout functionality are unaffected by this story; search only affects which products are rendered in the grid.
- A7: No new backend endpoint, DTO, or controller change is required, since filtering is client-side against already-fetched data.
- A8: Styling of the search box and the "No products found" message will follow the existing inline CSS conventions in `index.html` (no new CSS framework introduced).

## Functional Requirements

- FR1: The UI shall render a text input ("search box") positioned above the product grid, on the storefront page.
- FR2: On every keystroke (input event) in the search box, the product grid shall re-render to show only products whose `name` matches the current search term.
- FR3: The match algorithm shall be: trim the input value; if the trimmed value is empty, treat it as "no filter" and show all products; otherwise perform a case-insensitive check that the product's `name` starts with the trimmed input value.
- FR4: If zero products match a non-empty trimmed search term, the product grid area shall display a "No products found" message instead of product cards.
- FR5: When the search term is cleared (becomes empty or whitespace-only), the full, unfiltered list of products (in original order) shall be displayed again and the "No products found" message shall be hidden/removed.
- FR6: Filtering shall operate only on the in-memory `products` array already loaded by the existing `fetch('/api/products')` call; no additional network request shall be triggered by typing in the search box.
- FR7: The "Add To Cart" behavior for any visible (filtered) product card shall continue to work exactly as it does today (unchanged `add(id)` behavior), including for cart rendering and totals.

## Non-Functional Requirements

- NFR1: Filtering shall be synchronous and applied on every keystroke without debounce or throttling.
- NFR2: Filtering must not introduce a new HTTP request; it operates entirely on client-side JavaScript state.
- NFR3: The implementation shall reuse the existing plain HTML/CSS/JS approach in `index.html` (no new frontend framework/build tooling).
- NFR4: The change shall not degrade the existing checkout or cart-rendering behavior.
- NFR5: Accessibility improvements (ARIA roles, keyboard-only operation guarantees, screen-reader announcements) are explicitly not required for this story.

## Acceptance Criteria (Given/When/Then)

**AC1 — Prefix match narrows results**
- Given the product grid is showing all loaded products
- When the shopper types a case-insensitive prefix of a product's name into the search box (e.g., types `"sh"` and a product is named `"Shoes"`)
- Then the grid shows only products whose name starts with that typed text, and hides all others.

**AC2 — Non-prefix substring does not match**
- Given the product grid is showing all loaded products
- When the shopper types a term that appears in the middle of a product name but not at the start (e.g., types `"oes"` when a product is named `"Shoes"`)
- Then that product is NOT shown as a match (substring/contains matching is not applied).

**AC3 — Instant filtering, no debounce**
- Given the shopper is typing in the search box
- When each keystroke occurs
- Then the grid updates immediately after that keystroke, with no delay or debounce waiting for further input.

**AC4 — No results state**
- Given the shopper has typed a search term
- When zero products' names start with that term (case-insensitive)
- Then the product grid shows no product cards and displays a "No products found" message.

**AC5 — Clearing search restores full grid**
- Given the search box currently contains text and the grid is filtered
- When the shopper clears the search box (deletes all characters)
- Then all originally loaded products are shown again and any "No products found" message is removed.

**AC6 — Whitespace-only input treated as empty**
- Given the search box is empty
- When the shopper types only spaces (e.g., `"   "`) into the search box
- Then the grid behaves as if the search term were empty and shows all products (no "No products found" message).

**AC7 — Leading/trailing whitespace trimmed**
- Given a product named `"Shoes"` exists in the catalog
- When the shopper types `"  sh"` (leading spaces) or `"sh  "` (trailing spaces) into the search box
- Then the product `"Shoes"` is matched exactly as if the shopper had typed `"sh"`.

**AC8 — Case-insensitivity**
- Given a product named `"Shoes"` exists in the catalog
- When the shopper types `"SH"`, `"sh"`, or `"Sh"`
- Then the product `"Shoes"` is matched in all three cases.

**AC9 — No new network calls**
- Given the product catalog has already been loaded once via `GET /api/products`
- When the shopper types in the search box
- Then no additional network request is made as a result of typing.

**AC10 — Cart behavior unaffected**
- Given the grid is showing a filtered subset of products
- When the shopper clicks "Add To Cart" on a visible product card
- Then that product is added to the cart and the cart/total render exactly as before this change.

## Out of Scope

- Server-side search: no new or modified backend endpoint/query for filtering; all matching happens client-side against already-fetched data.
- Debounce/throttle: input handling will not delay filtering after keystrokes.
- Substring/contains matching: matching only the start of the product name; mid-string or end-of-string matches are not supported.
- Description/category matching: not implemented, since the `Product` model has no `description` or `category` field.
- Accessibility enhancements: ARIA attributes, keyboard navigation guarantees, and screen-reader support are not part of this story.
- Automated test authoring: writing unit/integration/UI automated tests is deferred to a later phase and is not a deliverable of this requirements/implementation story.
- Pagination, sorting, fuzzy/typo-tolerant search, highlighting matched text, and search history/persistence are not part of this story.
