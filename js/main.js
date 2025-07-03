document.addEventListener('DOMContentLoaded', () => {
  const productList = document.getElementById('product-list');
  const categorySelect = document.getElementById('category-select');
  const priceSelect = document.getElementById('price-select');
  const cartCountElement = document.querySelector('.cart-count');
  const scrollTopBtn = document.getElementById('scrollTop');
  let cart = JSON.parse(localStorage.getItem('kanistick_cart')) || [];
  let productos = [];

  // ========== CARGAR PRODUCTOS ==========
  fetch('productos.json')
    .then(res => res.json())
    .then(data => {
      productos = data;
      renderProductos(productos);
    });

  // ========== EVENTOS ==========
  categorySelect.addEventListener('change', aplicarFiltros);
  priceSelect.addEventListener('change', aplicarFiltros);

  // ========== FUNCIONES ==========
  function renderProductos(lista) {
    productList.innerHTML = '';
    lista.forEach(producto => {
      const card = document.createElement('div');
      card.className = 'product-card fade-in';
      card.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p class="price">S/ ${producto.precio}</p>
        <button class="add-to-cart-btn">Agregar al carrito</button>
      `;
      card.querySelector('.add-to-cart-btn').addEventListener('click', () => addToCart(producto));
      productList.appendChild(card);
    });
  }

  function aplicarFiltros() {
    const categoria = categorySelect.value;
    const ordenPrecio = priceSelect.value;

    let filtrados = [...productos];

    if (categoria) {
      filtrados = filtrados.filter(p => p.categoria === categoria);
    }

    if (ordenPrecio === 'asc') {
      filtrados.sort((a, b) => a.precio - b.precio);
    } else if (ordenPrecio === 'desc') {
      filtrados.sort((a, b) => b.precio - a.precio);
    }

    renderProductos(filtrados);
  }

  function addToCart(producto) {
    const existente = cart.find(item => item.nombre === producto.nombre);
    if (existente) {
      existente.cantidad++;
    } else {
      cart.push({ ...producto, cantidad: 1 });
    }
    actualizarCarrito();
    mostrarNotificacion(producto.nombre);
  }

  function actualizarCarrito() {
    const total = cart.reduce((acc, item) => acc + item.cantidad, 0);
    cartCountElement.textContent = total;
    localStorage.setItem('kanistick_cart', JSON.stringify(cart));
  }

function mostrarNotificacion(nombre) {
  const notif = document.createElement('div');
  notif.className = 'toast-notification';
  notif.innerHTML = `<i class="fas fa-check-circle"></i> ${nombre} agregado al carrito`;

  document.body.appendChild(notif);
  setTimeout(() => notif.classList.add('visible'), 100);
  setTimeout(() => {
    notif.classList.remove('visible');
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}


  // ========== SCROLL ==========
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    if (window.scrollY > 300) scrollTopBtn.classList.add('visible');
    else scrollTopBtn.classList.remove('visible');
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Inicializar contador
  actualizarCarrito();
});
