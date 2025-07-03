// catalog.js - Versión Mejorada

// Espera que el DOM esté listo
window.addEventListener('DOMContentLoaded', () => {
  const productGrid = document.getElementById('product-grid');
  const categorySelect = document.getElementById('category-select');
  const sortSelect = document.getElementById('sort-select');
  const priceRange = document.getElementById('price-range');
  const priceValue = document.getElementById('price-value');
  const cartCount = document.querySelector('.cart-count');

  let productos = [];
  let carrito = JSON.parse(localStorage.getItem('kanistick_cart')) || [];

  // ========= CARGAR PRODUCTOS =========
  fetch('productos.json')
    .then(res => {
      if (!res.ok) {
        throw new Error('No se pudo cargar productos.json');
      }
      return res.json();
    })
    .then(data => {
      productos = data;
      cargarCategorias();
      renderizarProductos(productos);
      actualizarContador();
      configurarFiltros();
    })
    .catch(error => {
      console.error('Error cargando productos:', error);
      mostrarErrorCarga();
    });

  // ========= MOSTRAR ERROR DE CARGA =========
  function mostrarErrorCarga() {
    productGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ff6b6b; margin-bottom: 1rem;"></i>
        <h3 style="color: var(--text-secondary);">Error al cargar productos</h3>
        <p style="color: var(--text-secondary);">No se pudo conectar con el archivo productos.json</p>
        <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--accent); color: var(--primary); border: none; border-radius: 6px; cursor: pointer;">
          Reintentar
        </button>
      </div>
    `;
  }

  // ========= CARGAR CATEGORÍAS ÚNICAS =========
  function cargarCategorias() {
    const categoriasUnicas = [...new Set(productos.map(p => p.categoria))];
    
    // Limpiar opciones existentes (excepto "Todas las categorías")
    categorySelect.innerHTML = '<option value="">Todas las categorías</option>';
    
    categoriasUnicas.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      categorySelect.appendChild(option);
    });
  }

  // ========= CONFIGURAR FILTROS =========
  function configurarFiltros() {
    // Configurar rango de precios basado en productos reales
    const precios = productos.map(p => p.precio);
    const precioMin = Math.min(...precios);
    const precioMax = Math.max(...precios);
    
    priceRange.min = precioMin;
    priceRange.max = Math.ceil(precioMax / 100) * 100; // Redondear hacia arriba
    priceRange.value = priceRange.max;
    priceRange.step = Math.ceil((precioMax - precioMin) / 100);
    
    actualizarDisplayPrecio();
  }

  // ========= ACTUALIZAR DISPLAY DE PRECIO =========
  function actualizarDisplayPrecio() {
    if (priceValue) {
      priceValue.textContent = `Hasta S/ ${priceRange.value}`;
    }
  }

  // ========= EVENTOS =========
  if (categorySelect) {
    categorySelect.addEventListener('change', aplicarFiltros);
  }
  
  if (sortSelect) {
    sortSelect.addEventListener('change', aplicarFiltros);
  }
  
  if (priceRange) {
    priceRange.addEventListener('input', () => {
      actualizarDisplayPrecio();
      aplicarFiltros();
    });
  }

  // ========= RENDERIZAR PRODUCTOS =========
  function renderizarProductos(lista) {
    if (!productGrid) return;
    
    productGrid.innerHTML = '';

    if (lista.length === 0) {
      productGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
          <i class="fas fa-search" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
          <h3 style="color: var(--text-secondary);">No se encontraron productos</h3>
          <p style="color: var(--text-secondary);">Intenta ajustar los filtros de búsqueda</p>
        </div>
      `;
      return;
    }

    lista.forEach((producto, index) => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'all 0.6s ease';
      
      card.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x200?text=Imagen+no+disponible'">
        <h3>${producto.nombre}</h3>
        <p class="product-description">${producto.descripcion || 'Descripción no disponible'}</p>
        <div class="product-price">S/ ${producto.precio.toFixed(2)}</div>
        <button class="add-to-cart-btn">
          <i class="fas fa-shopping-cart"></i> Agregar al Carrito
        </button>
      `;

      const button = card.querySelector('.add-to-cart-btn');
      button.addEventListener('click', (e) => {
        e.preventDefault();
        agregarAlCarrito(producto);
        mostrarNotificacion(producto.nombre);
        
        // Efecto visual en el botón
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
          button.style.transform = 'scale(1)';
        }, 150);
      });

      productGrid.appendChild(card);
      
      // Animación de entrada
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  // ========= APLICAR FILTROS =========
  function aplicarFiltros() {
    let filtrados = [...productos];

    const categoria = categorySelect ? categorySelect.value : '';
    const orden = sortSelect ? sortSelect.value : '';
    const precioMax = priceRange ? parseInt(priceRange.value) : Infinity;

    // Filtrar por categoría
    if (categoria) {
      filtrados = filtrados.filter(p => p.categoria === categoria);
    }

    // Filtrar por precio
    if (!isNaN(precioMax)) {
      filtrados = filtrados.filter(p => p.precio <= precioMax);
    }

    // Ordenar
    switch (orden) {
      case 'asc':
        filtrados.sort((a, b) => a.precio - b.precio);
        break;
      case 'desc':
        filtrados.sort((a, b) => b.precio - a.precio);
        break;
      case 'name':
        filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      default:
        // Mantener orden original
        break;
    }

    renderizarProductos(filtrados);
  }

  // ========= AGREGAR AL CARRITO =========
  function agregarAlCarrito(producto) {
    const existe = carrito.find(p => p.nombre === producto.nombre);
    if (existe) {
      existe.cantidad++;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }
    
    // Guardar en localStorage
    localStorage.setItem('kanistick_cart', JSON.stringify(carrito));
    actualizarContador();
  }

  // ========= ACTUALIZAR CONTADOR =========
  function actualizarContador() {
    if (cartCount) {
      const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
      cartCount.textContent = total;
      
      // Animación del contador
      cartCount.style.transform = 'scale(1.2)';
      setTimeout(() => {
        cartCount.style.transform = 'scale(1)';
      }, 200);
    }
  }

  // ========= NOTIFICACIÓN VISUAL =========
  function mostrarNotificacion(nombre) {
    // Verificar si existe el elemento toast en el HTML
    let toast = document.getElementById('toast-notification');
    
    if (!toast) {
      // Crear toast si no existe
      toast = document.createElement('div');
      toast.id = 'toast-notification';
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
    }
    
    toast.innerHTML = `<i class="fas fa-check-circle"></i><span> ${nombre} agregado al carrito</span>`;
    
    // Mostrar notificación
    toast.classList.add('visible');
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 3000);
    
    // También usar la función global si existe
    if (typeof mostrarNotificacionGlobal === 'function') {
      mostrarNotificacionGlobal(`${nombre} agregado al carrito`);
    }
  }

  // ========= INICIALIZACIÓN =========
  // Actualizar contador al cargar la página
  actualizarContador();
  
  // Manejar errores de imágenes globalmente
  document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
      e.target.src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
    }
  }, true);
});

// ========= FUNCIONES GLOBALES AUXILIARES =========

// Función para limpiar localStorage (útil para desarrollo)
window.limpiarCarrito = function() {
  localStorage.removeItem('kanistick_cart');
  location.reload();
};

// Función para ver el contenido del carrito (útil para debugging)
window.verCarrito = function() {
  const carrito = JSON.parse(localStorage.getItem('kanistick_cart')) || [];
  console.table(carrito);
  return carrito;
};