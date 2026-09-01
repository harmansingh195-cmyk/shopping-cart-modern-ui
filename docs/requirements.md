# Requirements: Product Name Search

## Scope / Overview
Add a product search experience that lets shoppers quickly find products by typing a name into a search box. The product list should update as the shopper types, using case-insensitive matching against product names only.

## Assumptions
- Search applies only to the product name field.
- Filtering happens on the currently available product list.
- An empty search query restores the full product list.
- Matching is case-insensitive and based on partial text in the product name.

## Functional Requirements
1. A search box shall be displayed above or near the product list.
2. The product list shall filter dynamically as the user types in the search box.
3. Filtering shall match product names in a case-insensitive manner.
4. A partial match within the product name shall be sufficient to include a product in the results.
5. Clearing the search box shall show all products.
6. If no products match the search term, the UI shall show an empty state or no-results state.

## Non-Functional Requirements
1. Search filtering shall feel responsive during normal typing.
2. The search interaction shall preserve the existing product list layout and navigation behavior.
3. The solution shall work consistently across supported browsers and screen sizes.

## Acceptance Criteria
- Given the product list page is open, when the page loads, then a search box is visible.
- Given products are displayed, when the shopper types a product name or part of a product name, then the list filters to matching products.
- Given the shopper enters text with different letter case, when matching products exist, then the correct products are still shown.
- Given the shopper clears the search box, when the input is empty, then all products are shown again.
- Given no product names match the query, when the shopper searches, then the UI shows no matching products.

## Out of Scope
- Searching by product description, category, price, or other fields.
- Server-side search, pagination, or search history.
- Search suggestions, autocomplete, or advanced filtering.