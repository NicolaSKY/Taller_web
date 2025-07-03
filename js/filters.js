// ================= FILTERS.JS =================

document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const sortSelect = document.getElementById('sort-select');
    const priceRangeInput = document.querySelector('.price-range');
    const filterCheckboxes = document.querySelectorAll('.filter-section input[type="checkbox"]');

    if (!productGrid || !sortSelect || !priceRangeInput || filterCheckboxes.length === 0) {
        console.warn('❗ Elementos de filtro no encontrados.');
        return;
    }

    let filteredProducts = [...products];

    const renderProducts = (items) => {
        productGrid.innerHTML = items.map(product => `
            <div class="product-card fade-in">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
                <button onclick="addToCart(${product.id})" class="add-to-cart-btn">Add to Cart</button>
                <button onclick="quickView(${product.id})" class="quick-view-btn">Quick View</button>
            </div>
        `).join('');
    };

    const filterProducts = () => {
        const selectedCategories = Array.from(filterCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        const maxPrice = parseFloat(priceRangeInput.value) || Infinity;
        const sortValue = sortSelect.value;

        filteredProducts = products.filter(product => {
            const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
            const matchPrice = product.price <= maxPrice;
            return matchCategory && matchPrice;
        });

        sortFilteredProducts(sortValue);
        renderProducts(filteredProducts);
    };

    const sortFilteredProducts = (sortValue) => {
        const sorters = {
            'price-low': (a, b) => a.price - b.price,
            'price-high': (a, b) => b.price - a.price,
            'name': (a, b) => a.name.localeCompare(b.name)
        };
        filteredProducts.sort(sorters[sortValue] || (() => 0));
    };

    // Bind event listeners
    [...filterCheckboxes, priceRangeInput, sortSelect].forEach(el =>
        el.addEventListener('change', filterProducts)
    );

    // Inicializar
    renderProducts(products);
});
