document.addEventListener('DOMContentLoaded', async () => {
  const productList = document.getElementById('product-list');
  const categorySelect = document.getElementById('category-select');
  const priceSelect = document.getElementById('price-select');
  const cartCountElement = document.querySelector('.cart-count');
  const scrollTopBtn = document.getElementById('scrollTop');

  const modal = document.getElementById('modalProducto');
  const closeModalBtn = modal.querySelector('.close');
  const modalImg = document.getElementById('modal-img');
  const modalNombre = document.getElementById('modal-nombre');
  const modalMarca = document.getElementById('modal-marca');
  const modalPrecio = document.getElementById('modal-precio');
  const modalColores = document.getElementById('modal-colores');
  const modalStock = document.getElementById('modal-stock');
  const modalTamano = document.getElementById('modal-tamano');
  const modalDescripcion = document.getElementById('modal-descripcion');
  const modalAgregarBtn = document.getElementById('agregar-carrito');

  let productos = [];
  let carrito = JSON.parse(localStorage.getItem('kanistick_cart')) || [];

  // Cargar productos
  try {
    const res = await fetch('productos.json');
    productos = await res.json();
    renderProductos(productos);
    actualizarCarrito();
  } catch (err) {
    console.error('Error al cargar productos:', err);
  }

  // Renderizado de productos
  function renderProductos(lista) {
    productList.innerHTML = '';
    lista.forEach((producto, index) => {
      const card = document.createElement('div');
      card.className = 'product-card fade-in';
      card.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p class="price">S/ ${producto.precio}</p>
        <button class="add-to-cart-btn">Agregar al carrito</button>
      `;

      // Evento agregar al carrito
      card.querySelector('.add-to-cart-btn').addEventListener('click', () => {
        addToCart(producto);
      });

      // Evento ver más (mostrar modal)
      card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('add-to-cart-btn')) {
          mostrarModal(producto);
        }
      });

      productList.appendChild(card);
    });
  }

  // Mostrar modal con info del producto
  function mostrarModal(producto) {
    modalImg.src = producto.imagen;
    modalNombre.textContent = producto.nombre;
    modalMarca.textContent = producto.marca;
    modalPrecio.textContent = producto.precio;
    modalColores.textContent = producto.colores?.join(', ') || 'N/A';
    modalStock.textContent = producto.stock;
    modalTamano.textContent = producto.tamano || 'Único';
    modalDescripcion.textContent = producto.descripcion;

    modalAgregarBtn.onclick = () => {
      addToCart(producto);
      modal.style.display = 'none';
    };

    modal.style.display = 'block';
  }

  // Agregar al carrito
  function addToCart(producto) {
    const index = carrito.findIndex(p => p.nombre === producto.nombre);
    if (index >= 0) {
      carrito[index].cantidad += 1;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }

    actualizarCarrito();
    mostrarNotificacion(producto.nombre);
  }

  // Actualizar contador del carrito
  function actualizarCarrito() {
    const total = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    cartCountElement.textContent = total;
    localStorage.setItem('kanistick_cart', JSON.stringify(carrito));
  }

  // Filtros
  categorySelect.addEventListener('change', aplicarFiltros);
  priceSelect.addEventListener('change', aplicarFiltros);

  function aplicarFiltros() {
    let lista = [...productos];

    const categoria = categorySelect.value;
    const orden = priceSelect.value;

    if (categoria) lista = lista.filter(p => p.categoria === categoria);
    if (orden === 'asc') lista.sort((a, b) => a.precio - b.precio);
    else if (orden === 'desc') lista.sort((a, b) => b.precio - a.precio);

    renderProductos(lista);
  }

  // Notificación toast
  function mostrarNotificacion(nombre) {
    const notif = document.createElement('div');
    notif.className = 'toast-notification';
    notif.innerHTML = `<i class="fas fa-check-circle"></i> ${nombre} agregado al carrito`;
    document.body.appendChild(notif);
    setTimeout(() => notif.classList.add('visible'), 100);
    setTimeout(() => {
      notif.classList.remove('visible');
      notif.remove();
    }, 3000);
  }

  // Scroll top
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) scrollTopBtn.classList.add('visible');
    else scrollTopBtn.classList.remove('visible');
  });

  // Cerrar modal
  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});
