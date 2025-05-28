// Filter and sort functionality
document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    let filteredProducts = [...products];

    // Render products
    function renderProducts(products) {
        productGrid.innerHTML = products.map(product => `
            <div class="product-card fade-in">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
                <button onclick="addToCart(${product.id})" class="add-to-cart-btn">
                    Add to Cart
                </button>
                <button onclick="quickView(${product.id})" class="quick-view-btn">
                    Quick View
                </button>
            </div>
        `).join('');
    }

    // Filter products
    function filterProducts() {
        const checkedCategories = Array.from(document.querySelectorAll('.filter-section input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.value);
        const priceRange = document.querySelector('.price-range').value;
        const sortValue = document.getElementById('sort-select').value;

        filteredProducts = products.filter(product => {
            const matchesCategory = checkedCategories.length === 0 || checkedCategories.includes(product.category);
            const matchesPrice = product.price <= priceRange;
            return matchesCategory && matchesPrice;
        });

        // Sort products
        switch(sortValue) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }

        renderProducts(filteredProducts);
    }

    // Add event listeners
    document.querySelectorAll('.filter-section input').forEach(input => {
        input.addEventListener('change', filterProducts);
    });

    document.getElementById('sort-select').addEventListener('change', filterProducts);

    // Initial render
    renderProducts(products);
});