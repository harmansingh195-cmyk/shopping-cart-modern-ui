const test = require('node:test');
const assert = require('node:assert/strict');
const { filterProducts } = require('../../main/resources/static/app.js');

const products = [
  { id: 1, name: 'Wireless Mouse', price: 799, image: '🖱️' },
  { id: 2, name: 'Mechanical Keyboard', price: 1899, image: '⌨️' },
  { id: 3, name: 'USB-C Hub', price: 1299, image: '🔌' }
];

test('filterProducts returns full list for blank searches', () => {
  const result = filterProducts(products, '   ');

  assert.deepStrictEqual(result, products);
  assert.notStrictEqual(result, products);
});

test('filterProducts matches names case-insensitively and trims input', () => {
  const result = filterProducts(products, '  keyboard  ');

  assert.deepStrictEqual(result, [products[1]]);
});

test('filterProducts returns empty list when nothing matches', () => {
  const result = filterProducts(products, 'monitor');

  assert.deepStrictEqual(result, []);
});
