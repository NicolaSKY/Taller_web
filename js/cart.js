// cart.js

const cartItemsContainer = document.getElementById('cart-items');
const subtotalElement = document.getElementById('subtotal');
const shippingElement = document.getElementById('shipping');
const totalElement = document.getElementById('total');
const cartCountElement = document.querySelector('.cart-count');

let cart = JSON.parse(localStorage.getItem('kanistick_cart')) || [];

function renderCart() {
  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <h3>Tu carrito está vacío</h3>
        <a href="index.html" class="continue-shopping">Seguir comprando</a>
      </div>
    `;
    subtotalElement.textContent = 'S/ 0.00';
    shippingElement.textContent = 'S/ 0.00';
    totalElement.textContent = 'S/ 0.00';
    return;
  }

  let subtotal = 0;
  cart.forEach((item, index) => {
    const itemTotal = item.precio * item.cantidad;
    subtotal += itemTotal;

    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';
    itemElement.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}" class="item-image">
      <div class="product-card">
        <h3>${item.nombre}</h3>
        <p class="product-description">Cantidad: ${item.cantidad}</p>
        <p class="product-price">S/ ${itemTotal.toFixed(2)}</p>
      </div>
      <div class="quantity-controls">
        <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
        <input type="text" class="quantity-input" value="${item.cantidad}" readonly>
        <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
      </div>
      <button class="remove-item" onclick="removeItem(${index})">
        <i class="fas fa-trash"></i>
      </button>
    `;
    cartItemsContainer.appendChild(itemElement);
  });

  const shipping = subtotal > 0 ? 15 : 0;
  const total = subtotal + shipping;

  subtotalElement.textContent = `S/ ${subtotal.toFixed(2)}`;
  shippingElement.textContent = `S/ ${shipping.toFixed(2)}`;
  totalElement.textContent = `S/ ${total.toFixed(2)}`;

  cartCountElement.textContent = cart.reduce((acc, item) => acc + item.cantidad, 0);
}

function updateQuantity(index, change) {
  cart[index].cantidad += change;
  if (cart[index].cantidad <= 0) {
    cart.splice(index, 1);
  }
  saveCart();
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem('kanistick_cart', JSON.stringify(cart));
}

// Navbar scroll efecto
window.addEventListener('scroll', () => {
  document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 50);
});

// Inicializar carrito al cargar
renderCart();

// Mostrar modal al hacer clic en "Proceder a la Compra"
document.querySelector('.checkout-btn')?.addEventListener('click', () => {
  document.getElementById('paymentModal').style.display = 'flex';
});

// Cerrar modal
function closePaymentModal() {
  document.getElementById('paymentModal').style.display = 'none';
}

// Finalizar compra
document.getElementById('paymentForm')?.addEventListener('submit', (e) => {
  e.preventDefault();

  // Aquí podrías agregar validación o envío a backend
  alert("✅ ¡Compra realizada con éxito!");

  // Vaciar carrito
  cart = [];
  saveCart();
  renderCart();

  // Cerrar modal
  closePaymentModal();
});
