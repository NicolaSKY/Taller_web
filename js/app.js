document.addEventListener('DOMContentLoaded', async () => {
  const productosContainer = document.getElementById('productos-container');
  const modal = document.getElementById('modal');
  const cerrarModal = document.getElementById('cerrar-modal');

  const modalNombre = document.getElementById('modal-nombre');
  const modalDescripcion = document.getElementById('modal-descripcion');
  const modalPrecio = document.getElementById('modal-precio');
  const modalStock = document.getElementById('modal-stock');
  const modalColores = document.getElementById('modal-colores');
  const modalMarca = document.getElementById('modal-marca');
  const modalImagen = document.getElementById('modal-imagen');

  try {
    const respuesta = await fetch('productos.json');
    const productos = await respuesta.json();

    productos.forEach(prod => {
      const div = document.createElement('div');
      div.className = 'producto';
      div.innerHTML = `
        <img src="${prod.imagen}" width="100">
        <h3>${prod.nombre}</h3>
        <p>S/.${prod.precio}</p>
      `;

      div.addEventListener('click', () => {
        modalNombre.textContent = prod.nombre;
        modalDescripcion.textContent = prod.descripcion;
        modalPrecio.textContent = prod.precio;
        modalStock.textContent = prod.stock;
        modalColores.textContent = prod.colores.join(', ');
        modalMarca.textContent = prod.marca;
        modalImagen.src = prod.imagen;

        modal.classList.remove('oculto');
      });

      productosContainer.appendChild(div);
    });

    cerrarModal.addEventListener('click', () => {
      modal.classList.add('oculto');
    });

    // Cerrar si se hace clic fuera del modal
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('oculto');
      }
    });
  } catch (error) {
    console.error('Error cargando productos:', error);
  }
});
