const { test, expect } = require('@playwright/test');

test.describe('Product search requirement verification', () => {
  test('shows the search box and full catalog initially', async ({ page }) => {
    await page.goto('http://localhost:8080');

    const searchInput = page.getByLabel('Search products by name');
    await expect(searchInput).toBeVisible();
    await expect(page.locator('#products .card')).toHaveCount(4);
  });

  test('filters products as the shopper types by product name', async ({ page }) => {
    await page.goto('http://localhost:8080');

    const searchInput = page.getByLabel('Search products by name');
    await searchInput.fill('key');

    await expect(page.locator('#products .card')).toHaveCount(1);
    await expect(page.locator('#products .card h3')).toContainText('Keyboard');
  });

  test('search is case-insensitive and empty search restores all products', async ({ page }) => {
    await page.goto('http://localhost:8080');

    const searchInput = page.getByLabel('Search products by name');
    await searchInput.fill('LAP');
    await expect(page.locator('#products .card')).toHaveCount(1);
    await expect(page.locator('#products .card h3')).toContainText('Laptop');

    await searchInput.fill('');
    await expect(page.locator('#products .card')).toHaveCount(4);
  });

  test('returns no products when no name matches', async ({ page }) => {
    await page.goto('http://localhost:8080');

    const searchInput = page.getByLabel('Search products by name');
    await searchInput.fill('zzz-no-match');

    await expect(page.locator('#products .card')).toHaveCount(0);
  });
});
