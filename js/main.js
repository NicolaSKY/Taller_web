// Global variables
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let products = [
    {
        id: 1,
        name: "Classic White T-Shirt",
        price: 29.99,
        image: "images/products/tshirt.jpg",
        category: "shirts"
    },
    {
        id: 2,
        name: "Slim Fit Jeans",
        price: 59.99,
        image: "images/products/jeans.jpg",
        category: "pants"
    },
    {
        id: 3,
        name: "Summer Dress",
        price: 79.99,
        image: "images/products/dress.jpg",
        category: "dresses"
    },
    // Add more products as needed
];

// Update cart count
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cartItems.reduce((total, item) => total + item.quantity, 0);
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});