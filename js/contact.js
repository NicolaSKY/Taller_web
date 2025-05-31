// ==============================================
// CONTACT.JS - Funciones específicas del contacto
// ==============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeContact();
});

function initializeContact() {
    setupContactForm();
    setupFormValidation();
    setupAnimations();
    setupInteractiveElements();
    console.log('📧 Formulario de contacto inicializado');
}

// ==================== FORMULARIO DE CONTACTO ====================

function setupContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    const formData = getFormData();
    
    if (validateForm(formData)) {
        showLoadingState();
        submitForm(formData);
    }
}

function getFormData() {
    return {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim()
    };
}

// ==================== VALIDACIÓN DEL FORMULARIO ====================

function setupFormValidation() {
    const inputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

function validateForm(formData) {
    let isValid = true;
    const errors = [];

    // Validar nombre
    if (!formData.name || formData.name.length < 2) {
        showFieldError('name', 'El nombre debe tener al menos 2 caracteres');
        errors.push('Nombre inválido');
        isValid = false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        showFieldError('email', 'Por favor ingresa un email válido');
        errors.push('Email inválido');
        isValid = false;
    }

    // Validar asunto
    if (!formData.subject || formData.subject.length < 5) {
        showFieldError('subject', 'El asunto debe tener al menos 5 caracteres');
        errors.push('Asunto inválido');
        isValid = false;
    }

    // Validar mensaje
    if (!formData.message || formData.message.length < 10) {
        showFieldError('message', 'El mensaje debe tener al menos 10 caracteres');
        errors.push('Mensaje inválido');
        isValid = false;
    }

    if (!isValid) {
        showNotification('Por favor corrige los errores en el formulario', 'error');
    }

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.id;

    switch(fieldName) {
        case 'name':
            if (!value || value.length < 2) {
                showFieldError('name', 'El nombre debe tener al menos 2 caracteres');
                return false;
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value || !emailRegex.test(value)) {
                showFieldError('email', 'Por favor ingresa un email válido');
                return false;
            }
            break;
        case 'subject':
            if (!value || value.length < 5) {
                showFieldError('subject', 'El asunto debe tener al menos 5 caracteres');
                return false;
            }
            break;
        case 'message':
            if (!value || value.length < 10) {
                showFieldError('message', 'El mensaje debe tener al menos 10 caracteres');
                return false;
            }
            break;
    }

    clearFieldError(field);
    return true;
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    
    // Remover error anterior
    const existingError = formGroup.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }

    // Agregar clase de error
    field.classList.add('error');
    
    // Crear mensaje de error
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    formGroup.appendChild(errorElement);

    // Animación de shake
    field.style.animation = 'shake 0.5s';
    setTimeout(() => {
        field.style.animation = '';
    }, 500);
}

function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.field-error');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    field.classList.remove('error');
}

// ==================== ENVÍO DEL FORMULARIO ====================

function submitForm(formData) {
    // Simular envío del formulario (en producción conectarías con tu backend)
    setTimeout(() => {
        hideLoadingState();
        
        // Simular respuesta exitosa
        if (Math.random() > 0.1) { // 90% de éxito
            handleFormSuccess(formData);
        } else {
            handleFormError('Error del servidor. Por favor intenta nuevamente.');
        }
    }, 2000);
}

function handleFormSuccess(formData) {
    showNotification('¡Mensaje enviado exitosamente! Te responderemos pronto.', 'success');
    
    // Limpiar formulario
    document.querySelector('.contact-form').reset();
    
    // Animación de éxito
    const form = document.querySelector('.contact-form');
    form.style.transform = 'scale(0.98)';
    form.style.opacity = '0.8';
    
    setTimeout(() => {
        form.style.transform = 'scale(1)';
        form.style.opacity = '1';
    }, 300);

    // Guardar en historial de contactos (simulado)
    saveContactToHistory(formData);
}

function handleFormError(errorMessage) {
    showNotification(errorMessage, 'error');
}

function showLoadingState() {
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.style.opacity = '0.7';
}

function hideLoadingState() {
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Enviar Mensaje';
    submitBtn.style.opacity = '1';
}

// ==================== NOTIFICACIONES ====================

function showNotification(message, type = 'info') {
    // Remover notificación anterior si existe
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="closeNotification(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    document.body.appendChild(notification);

    // Animación de entrada
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function closeNotification(element) {
    const notification = element.closest ? element.closest('.notification') : element;
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// ==================== ANIMACIONES ====================

function setupAnimations() {
    // Animación de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observar elementos animables
    const animatableElements = document.querySelectorAll('.contact-info, .contact-form');
    animatableElements.forEach(el => {
        el.classList.add('animate-element');
        observer.observe(el);
    });

    // Animación de contador para información de contacto
    animateContactInfo();
}

function animateContactInfo() {
    const infoSections = document.querySelectorAll('.info-section');
    infoSections.forEach((section, index) => {
        section.style.animationDelay = `${index * 0.2}s`;
        section.classList.add('fade-in-up');
    });
}

// ==================== ELEMENTOS INTERACTIVOS ====================

function setupInteractiveElements() {
    // Hover effects para secciones de información
    const infoSections = document.querySelectorAll('.info-section');
    infoSections.forEach(section => {
        section.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.boxShadow = '0 10px 30px rgba(124, 58, 237, 0.2)';
        });

        section.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
        });
    });

    // Click para copiar información de contacto
    setupCopyToClipboard();
    
    // Efectos de focus para inputs
    setupInputEffects();
}

function setupCopyToClipboard() {
    const copyableElements = document.querySelectorAll('.info-section p');
    copyableElements.forEach(element => {
        const text = element.textContent.trim();
        if (text.includes('@') || text.includes('+') || text.includes('Calle')) {
            element.style.cursor = 'pointer';
            element.title = 'Click para copiar';
            
            element.addEventListener('click', function() {
                navigator.clipboard.writeText(text).then(() => {
                    showNotification(`Copiado: ${text}`, 'success');
                    
                    // Efecto visual
                    this.style.background = 'rgba(6, 255, 165, 0.2)';
                    setTimeout(() => {
                        this.style.background = 'transparent';
                    }, 500);
                });
            });
        }
    });
}

function setupInputEffects() {
    const inputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    
    inputs.forEach(input => {
        // Efecto de focus
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });

        // Contador de caracteres para textarea
        if (input.tagName === 'TEXTAREA') {
            const counter = document.createElement('span');
            counter.className = 'char-counter';
            input.parentElement.appendChild(counter);
            
            input.addEventListener('input', function() {
                const current = this.value.length;
                const max = 500; // límite sugerido
                counter.textContent = `${current}/${max}`;
                counter.style.color = current > max ? '#f5576c' : '#B8BCC8';
            });
        }
    });
}

// ==================== FUNCIONES AUXILIARES ====================

function saveContactToHistory(formData) {
    // En un entorno real, esto se enviaría al servidor
    const contactHistory = JSON.parse(localStorage.getItem('contactHistory') || '[]');
    const contactEntry = {
        ...formData,
        timestamp: new Date().toISOString(),
        id: Date.now()
    };
    
    contactHistory.unshift(contactEntry);
    // Mantener solo los últimos 10 contactos
    contactHistory.splice(10);
    
    localStorage.setItem('contactHistory', JSON.stringify(contactHistory));
}

// ==================== ESTILOS DINÁMICOS ====================

// Agregar estilos CSS dinámicamente
const dynamicStyles = `
    .animate-element {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease-out;
    }

    .animate-element.animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    .fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }

    .form-group {
        position: relative;
        margin-bottom: 1.5rem;
        transition: all 0.3s ease;
    }

    .form-group.focused {
        transform: translateY(-2px);
    }

    .form-group input,
    .form-group textarea {
        transition: all 0.3s ease;
        border: 2px solid transparent;
    }

    .form-group input:focus,
    .form-group textarea:focus {
        border-color: var(--secondary);
        box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        outline: none;
    }

    .form-group input.error,
    .form-group textarea.error {
        border-color: #f5576c;
        box-shadow: 0 0 0 3px rgba(245, 87, 108, 0.1);
    }

    .field-error {
        display: block;
        color: #f5576c;
        font-size: 0.8rem;
        margin-top: 0.5rem;
        animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .char-counter {
        position: absolute;
        bottom: -20px;
        right: 0;
        font-size: 0.7rem;
        color: var(--text-secondary);
    }

    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--glass);
        backdrop-filter: blur(20px);
        border: 1px solid var(--glass-border);
        border-radius: var(--border-radius);
        padding: 1rem;
        z-index: 10000;
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.3s ease-out;
        max-width: 400px;
    }

    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .notification-success { border-left: 4px solid #06FFA5; }
    .notification-error { border-left: 4px solid #f5576c; }
    .notification-warning { border-left: 4px solid #fbbf24; }
    .notification-info { border-left: 4px solid #3b82f6; }

    .notification-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0.25rem;
        margin-left: auto;
        border-radius: 50%;
        transition: all 0.2s ease;
    }

    .notification-close:hover {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
    }

    .info-section {
        transition: all 0.3s ease;
        padding: 1.5rem;
        border-radius: var(--border-radius);
        background: var(--glass);
        border: 1px solid var(--glass-border);
        margin-bottom: 1rem;
    }

    .info-section:hover {
        background: rgba(255, 255, 255, 0.05);
    }

    .submit-btn {
        position: relative;
        overflow: hidden;
    }

    .submit-btn:disabled {
        cursor: not-allowed;
    }
`;

// Agregar estilos al documento
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);

console.log('🎨 Estilos dinámicos aplicados');
console.log('✨ Sistema de contacto completamente inicializado');