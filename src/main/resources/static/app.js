(function (global) {
    function filterProducts(products, query) {
        const normalizedQuery = typeof query === 'string' ? query.trim().toLowerCase() : '';

        if (!normalizedQuery) {
            return Array.isArray(products) ? [...products] : [];
        }

        return (Array.isArray(products) ? products : []).filter(function (product) {
            return typeof product?.name === 'string' && product.name.toLowerCase().includes(normalizedQuery);
        });
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { filterProducts };
    }

    global.filterProducts = filterProducts;
})(typeof window !== 'undefined' ? window : globalThis);

(function () {
    if (typeof document === 'undefined') {
        return;
    }

    const searchInput = document.getElementById('search');
    const productsContainer = document.getElementById('products');
    const statusMessage = document.getElementById('status');

    let products = [];
    let cart = [];
    let hasLoaded = false;

    function renderCart() {
        const items = document.getElementById('items');
        const total = document.getElementById('total');

        items.innerHTML = cart.map(function (item) {
            return '<p>' + item.name + '</p>';
        }).join('');

        total.innerText = cart.reduce(function (totalValue, item) {
            return totalValue + item.price;
        }, 0);
    }

    function renderProducts() {
        const query = searchInput ? searchInput.value : '';
        const filteredProducts = filterProducts(products, query);

        if (!hasLoaded && !products.length) {
            productsContainer.innerHTML = '';
            statusMessage.hidden = true;
            return;
        }

        if (!filteredProducts.length) {
            productsContainer.innerHTML = '';
            statusMessage.textContent = 'No products match your search.';
            statusMessage.hidden = false;
            return;
        }

        statusMessage.hidden = true;
        productsContainer.innerHTML = filteredProducts.map(function (product) {
            return '<div class=card><div class=emoji>' + product.image + '</div><h3>' + product.name + '</h3><p>₹' + product.price + '</p><button onclick=add(' + product.id + ')>Add To Cart</button></div>';
        }).join('');
    }

    function add(id) {
        const product = products.find(function (item) {
            return item.id === id;
        });

        if (product) {
            cart.push(product);
            renderCart();
        }
    }

    function checkout() {
        alert('Order placed successfully! Total ₹' + document.getElementById('total').innerText);
        cart = [];
        renderCart();
    }

    window.add = add;
    window.checkout = checkout;

    if (searchInput) {
        searchInput.addEventListener('input', function (event) {
            renderProducts(event.target.value);
        });
    }

    fetch('/api/products')
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Unable to load products.');
            }
            return response.json();
        })
        .then(function (data) {
            products = Array.isArray(data) ? data : [];
            hasLoaded = true;
            renderProducts();
        })
        .catch(function () {
            productsContainer.innerHTML = '';
            statusMessage.textContent = 'Something went wrong while loading products. Please try again later.';
            statusMessage.hidden = false;
        });

    renderCart();
})();
