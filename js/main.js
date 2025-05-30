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
    
    // Mouse parallax effect
    document.addEventListener('mousemove', (e) => {
        const body = document.body;
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        // Calculate the movement offset (smaller numbers = subtler effect)
        const moveX = mouseX * 20 - 10; // -10 to +10 pixels
        const moveY = mouseY * 20 - 10; // -10 to +10 pixels
        
        // Apply the transform with a smooth transition
        body.style.backgroundPosition = `calc(50% + ${moveX}px) calc(50% + ${moveY}px)`;
    });
});


function assignProductImages() {
    const productImages = document.querySelectorAll('.product-image');
    const totalImages = 9; // Number of available images
    
    productImages.forEach((img, index) => {
        const imageNumber = (index % totalImages) + 1;
        img.src = `img/${imageNumber}.jpg`;
        img.alt = `Product ${index + 1}`;
    });
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', assignProductImages);