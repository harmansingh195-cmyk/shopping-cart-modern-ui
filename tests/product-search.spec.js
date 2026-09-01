const { test, expect } = require('@playwright/test');

test('search box is visible and products load', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('#search')).toBeVisible();
  await expect(page.locator('#products .card')).toHaveCount(4);
});

test('typing a partial product name filters results case-insensitively', async ({ page }) => {
  await page.goto('/');

  await page.locator('#search').fill('KEY');

  await expect(page.locator('#products .card')).toHaveCount(1);
  await expect(page.locator('#products .card h3')).toHaveText(['Keyboard']);
});

test('clearing the search restores the full product list', async ({ page }) => {
  await page.goto('/');

  await page.locator('#search').fill('mouse');
  await expect(page.locator('#products .card')).toHaveCount(1);

  await page.locator('#search').fill('');
  await expect(page.locator('#products .card')).toHaveCount(4);
});

test('searching for no matching products shows the empty state', async ({ page }) => {
  await page.goto('/');

  await page.locator('#search').fill('tablet');

  await expect(page.locator('#status')).toBeVisible();
  await expect(page.locator('#status')).toHaveText(/No products match your search\./);
  await expect(page.locator('#products .card')).toHaveCount(0);
});
