import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSearchState, filterProducts, normalizeSearchText } from '../../main/resources/static/storefront.mjs';

const products = [
  { id: 1, name: 'Laptop', price: 55999, image: '💻' },
  { id: 2, name: 'Headphones', price: 2999, image: '🎧' },
  { id: 3, name: 'Keyboard', price: 1499, image: '⌨️' },
  { id: 4, name: 'Mouse', price: 899, image: '🖱️' }
];

test('normalizeSearchText trims whitespace and lowercases input', function () {
  assert.equal(normalizeSearchText('  LaP  '), 'lap');
});

test('filterProducts returns all products for empty or whitespace-only search', function () {
  assert.deepEqual(filterProducts(products, '   '), products);
  assert.deepEqual(filterProducts(products, ''), products);
});

test('filterProducts matches product name prefixes case-insensitively and preserves order', function () {
  assert.deepEqual(filterProducts(products, 'k'), [products[2]]);
  assert.deepEqual(filterProducts(products, 'la'), [products[0]]);
  assert.deepEqual(filterProducts(products, 'm'), [products[3]]);
});

test('buildSearchState reports empty state for non-matching queries', function () {
  const state = buildSearchState(products, 'xyz');

  assert.deepEqual(state.filteredProducts, []);
  assert.equal(state.showEmptyState, true);
});

test('buildSearchState does not show empty state for blank queries', function () {
  const state = buildSearchState(products, '  ');

  assert.deepEqual(state.filteredProducts, products);
  assert.equal(state.showEmptyState, false);
});
