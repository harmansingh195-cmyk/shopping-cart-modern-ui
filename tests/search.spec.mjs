import { test, expect } from '@playwright/test';

test.describe('product search', function () {
  test.beforeEach(async function ({ page }) {
    await page.goto('/');
    await expect(page.locator('#product-search')).toBeVisible();
    await expect(page.locator('#results .card')).toHaveCount(4);
  });

  test('filters products as the shopper types', async function ({ page }) {
    await page.locator('#product-search').fill('la');

    await expect(page.locator('#results .card')).toHaveCount(1);
    await expect(page.locator('#results .card h3')).toHaveText('Laptop');
  });

  test('shows an empty state when no products match', async function ({ page }) {
    await page.locator('#product-search').fill('zzz');

    await expect(page.locator('#results .card')).toHaveCount(0);
    await expect(page.locator('#results .empty-state')).toHaveText('No products match your search.');
  });

  test('treats whitespace-only input as empty search', async function ({ page }) {
    const search = page.locator('#product-search');
    await search.fill('   ');

    await expect(page.locator('#results .card')).toHaveCount(4);
    await expect(page.locator('#results .empty-state')).toHaveCount(0);
  });

  test('supports keyboard typing in the search box', async function ({ page }) {
    const search = page.locator('#product-search');
    await search.focus();
    await page.keyboard.type('m');

    await expect(search).toHaveValue('m');
    await expect(page.locator('#results .card')).toHaveCount(1);
    await expect(page.locator('#results .card h3')).toHaveText('Mouse');
  });
});
