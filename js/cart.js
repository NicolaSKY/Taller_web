// Funciones de ejemplo para la interactividad
function increaseQuantity() {
    // Lógica para incrementar cantidad
    console.log('Incrementar cantidad');
}

function decreaseQuantity() {
    // Lógica para decrementar cantidad
    console.log('Decrementar cantidad');
}

function removeItem() {
    // Lógica para remover item
    console.log('Remover item');
}

// Animación de scroll para navbar
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});