// ==============================================
// MAIN.JS - Funciones compartidas entre páginas
// ==============================================

// Variables globales
let cart = JSON.parse(localStorage.getItem('kanistick_cart')) || [];
let cartCount = 0;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Función principal de inicialización
function initializeApp() {
    updateCartDisplay();
    setupNavigation();
    setupScrollEffects();
    setupAnimations();
    console.log('🚀 KaniStick inicializado correctamente!');
}

// ==================== CARRITO ====================

// Función para agregar productos al carrito
function addToCart(productName, price) {
    const existingProduct = cart.find(item => item.name === productName);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            id: Date.now(),
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartDisplay();
    showCartNotification(productName);
}

// Guardar carrito en localStorage
function saveCart() {
    localStorage.setItem('kanistick_cart', JSON.stringify(cart));
}

// Cargar carrito desde localStorage
function loadCart() {
    cart = JSON.parse(localStorage.getItem('kanistick_cart')) || [];
    updateCartCount();
}

// Actualizar contador del carrito
function updateCartCount() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
}

// Actualizar visualización del carrito
function updateCartDisplay() {
    loadCart();
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

// Mostrar notificación de producto agregado
function showCartNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${productName} agregado al carrito</span>
    `;
    
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
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// ==================== NAVEGACIÓN ====================

// Configurar navegación suave
function setupNavigation() {
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
}

// Scroll suave
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

// ==================== EFECTOS DE SCROLL ====================

function setupScrollEffects() {
    window.addEventListener('scroll', function() {
        handleNavbarScroll();
        handleScrollTopButton();
    });
    
    // Botón scroll to top
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', scrollToTop);
    }
}

// Efecto navbar al hacer scroll
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}

// Mostrar/ocultar botón scroll to top
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

// Scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ==================== ANIMACIONES ====================

function setupAnimations() {
    // Intersection Observer para animaciones
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
    
    // Observar elementos animables
    const animatableElements = document.querySelectorAll('.product-card, .contact-form, .cart-item');
    animatableElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // Efectos hover para botones
    const buttons = document.querySelectorAll('.add-to-cart-btn, .cta-button, .submit-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ==================== UTILIDADES ====================

// Formatear precio
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

// Generar ID único
function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}