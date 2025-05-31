// Variables globales
let cart = [];
let cartCount = 0;

// Función para agregar productos al carrito
function addToCart(productName, price) {
    // Buscar si el producto ya existe en el carrito
    const existingProduct = cart.find(item => item.name === productName);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    cartCount++;
    updateCartDisplay();
    showCartNotification(productName);
    saveCartToStorage();
}

// Actualizar la visualización del contador del carrito
function updateCartDisplay() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        
        // Animación del contador
        cartCountElement.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartCountElement.style.transform = 'scale(1)';
        }, 200);
    }
}

// Mostrar notificación cuando se agrega un producto
function showCartNotification(productName) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${productName} agregado al carrito</span>
    `;
    
    // Estilos inline para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-size: 14px;
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animar salida y remover
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Guardar carrito en localStorage
function saveCartToStorage() {
    try {
        localStorage.setItem('kanistick_cart', JSON.stringify(cart));
        localStorage.setItem('kanistick_cart_count', cartCount.toString());
    } catch (error) {
        console.log('Error al guardar el carrito:', error);
    }
}

// Cargar carrito desde localStorage
function loadCartFromStorage() {
    try {
        const savedCart = localStorage.getItem('kanistick_cart');
        const savedCount = localStorage.getItem('kanistick_cart_count');
        
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
        if (savedCount) {
            cartCount = parseInt(savedCount);
        }
        updateCartDisplay();
    } catch (error) {
        console.log('Error al cargar el carrito:', error);
        cart = [];
        cartCount = 0;
    }
}

// Filtrado de productos por categoría
function filterProducts() {
    const categorySelect = document.getElementById('category-select');
    const selectedCategory = categorySelect.value;
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        let shouldShow = true;
        
        if (selectedCategory && selectedCategory !== '') {
            shouldShow = cardCategory === selectedCategory;
        }
        
        // Animación de filtrado
        if (shouldShow) {
            card.style.display = 'block';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Filtro por rango de precios
function filterByPrice() {
    const priceRange = document.getElementById('price-range');
    const maxPrice = parseFloat(priceRange.value);
    const productCards = document.querySelectorAll('.product-card');
    const maxPriceLabel = document.getElementById('max-price');
    
    maxPriceLabel.textContent = `$${maxPrice}`;
    
    productCards.forEach(card => {
        const price = parseFloat(card.getAttribute('data-price'));
        const shouldShow = price <= maxPrice;
        
        if (shouldShow) {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Ordenar productos
function sortProducts() {
    const sortSelect = document.getElementById('sort-select');
    const sortValue = sortSelect.value;
    const productGrid = document.getElementById('product-grid');
    const productCards = Array.from(productGrid.querySelectorAll('.product-card'));
    
    productCards.sort((a, b) => {
        switch (sortValue) {
            case 'price-low':
                return parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price'));
            case 'price-high':
                return parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price'));
            case 'name':
                const nameA = a.querySelector('h3').textContent;
                const nameB = b.querySelector('h3').textContent;
                return nameA.localeCompare(nameB);
            default:
                return 0;
        }
    });
    
    // Limpiar y reordenar
    productGrid.innerHTML = '';
    productCards.forEach(card => {
        productGrid.appendChild(card);
    });
}

// Scroll suave para navegación
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        const offsetTop = element.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Navbar scroll effect
function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Botón scroll to top
function handleScrollTopButton() {
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }
}

// Función para scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Event Listeners cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // Cargar carrito guardado
    loadCartFromStorage();
    
    // Filtro de categorías
    const categorySelect = document.getElementById('category-select');
    if (categorySelect) {
        categorySelect.addEventListener('change', filterProducts);
    }
    
    // Filtro de precio
    const priceRange = document.getElementById('price-range');
    if (priceRange) {
        priceRange.addEventListener('input', filterByPrice);
    }
    
    // Ordenamiento
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', sortProducts);
    }
    
    // Enlaces de navegación suave
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                smoothScroll(href);
            }
        });
    });
    
    // Botón scroll to top
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', scrollToTop);
    }
    
    // Eventos de scroll
    window.addEventListener('scroll', function() {
        handleNavbarScroll();
        handleScrollTopButton();
    });
    
    // Animación inicial de las tarjetas de producto
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar tarjetas de producto para animación
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Efecto hover mejorado para botones
    const buttons = document.querySelectorAll('.add-to-cart-btn, .cta-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    console.log('🚀 Catálogo KaniStick cargado correctamente!');
    console.log('Productos en carrito:', cartCount);
});

// Función para obtener el carrito (útil para cart.html)
function getCart() {
    return cart;
}

// Función para obtener el total del carrito
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Función para vaciar el carrito
function clearCart() {
    cart = [];
    cartCount = 0;
    updateCartDisplay();
    saveCartToStorage();
}

// Función para eliminar un producto del carrito
function removeFromCart(productName) {
    const productIndex = cart.findIndex(item => item.name === productName);
    if (productIndex > -1) {
        const product = cart[productIndex];
        cartCount -= product.quantity;
        cart.splice(productIndex, 1);
        updateCartDisplay();
        saveCartToStorage();
    }
}

// Función para actualizar cantidad de un producto
function updateQuantity(productName, newQuantity) {
    const product = cart.find(item => item.name === productName);
    if (product) {
        const oldQuantity = product.quantity;
        product.quantity = newQuantity;
        cartCount = cartCount - oldQuantity + newQuantity;
        updateCartDisplay();
        saveCartToStorage();
    }
}