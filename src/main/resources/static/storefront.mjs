export function normalizeSearchText(query) {
  return query.trim().toLowerCase();
}

export function filterProducts(products, query) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) {
    return products;
  }

  return products.filter(function (product) {
    return product.name.toLowerCase().startsWith(normalizedQuery);
  });
}

export function buildSearchState(products, query) {
  const normalizedQuery = normalizeSearchText(query);
  const filteredProducts = filterProducts(products, query);

  return {
    filteredProducts: filteredProducts,
    showEmptyState: normalizedQuery.length > 0 && filteredProducts.length === 0
  };
}

function createProductCard(product, onAdd) {
  const card = document.createElement('article');
  card.className = 'card';

  const emoji = document.createElement('div');
  emoji.className = 'emoji';
  emoji.textContent = product.image;

  const title = document.createElement('h3');
  title.textContent = product.name;

  const price = document.createElement('p');
  price.textContent = '₹' + product.price;

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Add To Cart';
  button.addEventListener('click', function () {
    onAdd(product.id);
  });

  card.appendChild(emoji);
  card.appendChild(title);
  card.appendChild(price);
  card.appendChild(button);

  return card;
}

function renderProducts(resultsContainer, state, onAdd) {
  resultsContainer.replaceChildren();

  if (state.showEmptyState) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'No products match your search.';
    resultsContainer.appendChild(empty);
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'grid';

  state.filteredProducts.forEach(function (product) {
    grid.appendChild(createProductCard(product, onAdd));
  });

  resultsContainer.appendChild(grid);
}

function renderCart(itemsContainer, totalContainer, cart) {
  itemsContainer.replaceChildren();

  cart.forEach(function (product) {
    const item = document.createElement('p');
    item.textContent = product.name;
    itemsContainer.appendChild(item);
  });

  const total = cart.reduce(function (sum, product) {
    return sum + product.price;
  }, 0);

  totalContainer.textContent = String(total);
}

export function initializeStorefront(options) {
  const searchInput = options.searchInput;
  const resultsContainer = options.resultsContainer;
  const itemsContainer = options.itemsContainer;
  const totalContainer = options.totalContainer;
  const checkoutButton = options.checkoutButton;
  const fetchProducts = options.fetchProducts;
  const alertFn = options.alertFn;

  const state = {
    products: [],
    cart: []
  };

  function rerender() {
    const searchState = buildSearchState(state.products, searchInput.value);
    renderProducts(resultsContainer, searchState, addToCart);
    renderCart(itemsContainer, totalContainer, state.cart);
  }

  function addToCart(productId) {
    const product = state.products.find(function (item) {
      return item.id === productId;
    });

    if (!product) {
      return;
    }

    state.cart.push(product);
    renderCart(itemsContainer, totalContainer, state.cart);
  }

  searchInput.addEventListener('input', rerender);
  checkoutButton.addEventListener('click', function () {
    alertFn('Order placed successfully! Total ₹' + totalContainer.textContent);
    state.cart = [];
    renderCart(itemsContainer, totalContainer, state.cart);
  });

  return fetchProducts()
    .then(function (products) {
      state.products = products;
      rerender();
    })
    .catch(function () {
      resultsContainer.replaceChildren();
      const error = document.createElement('div');
      error.className = 'empty-state';
      error.textContent = 'Unable to load products right now.';
      resultsContainer.appendChild(error);
    });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function () {
    initializeStorefront({
      searchInput: document.getElementById('product-search'),
      resultsContainer: document.getElementById('results'),
      itemsContainer: document.getElementById('items'),
      totalContainer: document.getElementById('total'),
      checkoutButton: document.getElementById('checkout-button'),
      fetchProducts: function () {
        return fetch('/api/products').then(function (response) {
          return response.json();
        });
      },
      alertFn: function (message) {
        window.alert(message);
      }
    });
  });
}
