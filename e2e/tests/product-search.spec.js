// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * End-to-end verification of the Product Search Box feature
 * (Jira EPMCDMETST-62766) against the running Spring Boot storefront at
 * src/main/resources/static/index.html.
 *
 * The hardcoded catalog served by GET /api/products (see
 * ProductController.all()) is:
 *   1 Laptop      55999  💻
 *   2 Headphones  2999   🎧
 *   3 Keyboard    1499   ⌨️
 *   4 Mouse       899    🖱️
 *
 * Tests reference acceptance criteria AC1-AC10 from src/docs/requirements.md.
 */

const PRODUCT_CARD = '.grid#products .card';
const SEARCH_INPUT = '#search';
const NO_RESULTS_TEXT = 'No products found';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator(PRODUCT_CARD)).toHaveCount(4);
});

// ---------------- Positive scenarios ----------------

test('AC1: prefix match narrows results to matching product only', async ({ page }) => {
  await page.locator(SEARCH_INPUT).fill('key');
  await expect(page.locator(PRODUCT_CARD)).toHaveCount(1);
  await expect(page.locator(PRODUCT_CARD)).toContainText('Keyboard');
});

test('AC3: filtering happens instantly per keystroke with no debounce', async ({ page }) => {
  await page.locator(SEARCH_INPUT).pressSequentially('mouse', { delay: 0 });
  // Assert immediately (no waitForTimeout) - if a debounce/setTimeout were
  // introduced, the grid would still show 4 (or a stale count) here.
  await expect(page.locator(PRODUCT_CARD)).toHaveCount(1);
  await expect(page.locator(PRODUCT_CARD)).toContainText('Mouse');
});

test('AC5: clearing the search box restores the full, original-order grid', async ({ page }) => {
  await page.locator(SEARCH_INPUT).fill('key');
  await expect(page.locator(PRODUCT_CARD)).toHaveCount(1);

  await page.locator(SEARCH_INPUT).fill('');
  await expect(page.locator(PRODUCT_CARD)).toHaveCount(4);
  await expect(page.locator(NO_RESULTS_TEXT)).toHaveCount(0);
  await expect(page.locator(PRODUCT_CARD).nth(0)).toContainText('Laptop');
  await expect(page.locator(PRODUCT_CARD).nth(1)).toContainText('Headphones');
  await expect(page.locator(PRODUCT_CARD).nth(2)).toContainText('Keyboard');
  await expect(page.locator(PRODUCT_CARD).nth(3)).toContainText('Mouse');
});

test('AC7: leading/trailing whitespace is trimmed before matching', async ({ page }) => {
  await page.locator(SEARCH_INPUT).fill('  ke');
  await expect(page.locator(PRODUCT_CARD)).toHaveCount(1);
  await expect(page.locator(PRODUCT_CARD)).toContainText('Keyboard');

  await page.locator(SEARCH_INPUT).fill('ke  ');
  await expect(page.locator(PRODUCT_CARD)).toHaveCount(1);
  await expect(page.locator(PRODUCT_CARD)).toContainText('Keyboard');
});

test('AC8: search is case-insensitive', async ({ page }) => {
  for (const term of ['KEY', 'key', 'Key', 'kEy']) {
    await page.locator(SEARCH_INPUT).fill(term);
    await expect(page.locator(PRODUCT_CARD)).toHaveCount(1);
    await expect(page.locator(PRODUCT_CARD)).toContainText('Keyboard');
  }
});

test('AC10: Add To Cart on a visible filtered product still works', async ({ page }) => {
  await page.locator(SEARCH_INPUT).fill('mouse');
  await expect(page.locator(PRODUCT_CARD)).toHaveCount(1);

  await page.getByRole('button', { name: 'Add To Cart' }).click();

  await expect(page.locator('#items')).toContainText('Mouse');
  await expect(page.locator('#total')).toHaveText('899');
});

// ---------------- Negative scenarios ----------------

test('AC2: a non-prefix substring match does not match the product', async ({ page }) => {
  // "ptop" appears inside "Laptop" but not at the start.
  await page.locator(SEARCH_INPUT).fill('ptop');
  await expect(page.locator(PRODUCT_CARD)).toHaveCount(0);
  await expect(page.getByText(NO_RESULTS_TEXT)).toBeVisible();
});

test('AC4: zero matches renders the "No products found" message and no cards', async ({ page }) => {
  await page.locator(SEARCH_INPUT).fill('zzz-does-not-exist');
  await expect(page.locator(PRODUCT_CARD)).toHaveCount(0);
  await expect(page.getByText(NO_RESULTS_TEXT)).toBeVisible();
});

test('AC9: typing in the search box triggers no additional network requests', async ({ page }) => {
  const apiRequests = [];
  page.on('request', (req) => {
    if (req.url().includes('/api/products')) {
      apiRequests.push(req.url());
    }
  });

  // Re-navigate under the listener so the initial load fetch is counted too.
  await page.goto('/');
  await expect(page.locator(PRODUCT_CARD)).toHaveCount(4);

  await page.locator(SEARCH_INPUT).pressSequentially('keyboard');
  await expect(page.locator(PRODUCT_CARD)).toHaveCount(1);

  expect(apiRequests.length).toBe(1);
});

// ---------------- Boundary scenarios ----------------

test('AC6: whitespace-only input is treated as empty and shows all products', async ({ page }) => {
  await page.locator(SEARCH_INPUT).fill('key');
  await expect(page.locator(PRODUCT_CARD)).toHaveCount(1);

  await page.locator(SEARCH_INPUT).fill('   ');
  await expect(page.locator(PRODUCT_CARD)).toHaveCount(4);
  await expect(page.locator(NO_RESULTS_TEXT)).toHaveCount(0);
});

test('FR1 boundary: the search input is rendered above the product grid in the DOM', async ({ page }) => {
  const order = await page.evaluate(() => {
    const search = document.getElementById('search');
    const grid = document.getElementById('products');
    const position = search.compareDocumentPosition(grid);
    // DOCUMENT_POSITION_FOLLOWING === 4 means grid follows search in the DOM.
    return position & Node.DOCUMENT_POSITION_FOLLOWING ? 'search-before-grid' : 'other';
  });
  expect(order).toBe('search-before-grid');
});
