// ================= CONTACT.JS =================

document.addEventListener('DOMContentLoaded', () => {
    initializeContact();
});

function initializeContact() {
    setupContactForm();
    setupFormValidation();
    setupAnimations();
    setupInteractiveElements();
    console.log('📧 Formulario de contacto inicializado');
}

// ============= FORMULARIO =============

function setupContactForm() {
    const contactForm = document.querySelector('.contact-form');
    contactForm?.addEventListener('submit', e => {
        e.preventDefault();
        const formData = getFormData();
        if (validateForm(formData)) {
            showLoadingState();
            submitForm(formData);
        }
    });
}

const getFormData = () => ({
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    subject: document.getElementById('subject').value.trim(),
    message: document.getElementById('message').value.trim()
});

// ============= VALIDACIÓN =============

function setupFormValidation() {
    document.querySelectorAll('.contact-form input, .contact-form textarea').forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

function validateForm({ name, email, subject, message }) {
    let isValid = true;

    if (!name || name.length < 2) {
        showFieldError('name', 'El nombre debe tener al menos 2 caracteres');
        isValid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFieldError('email', 'Por favor ingresa un email válido');
        isValid = false;
    }

    if (!subject || subject.length < 5) {
        showFieldError('subject', 'El asunto debe tener al menos 5 caracteres');
        isValid = false;
    }

    if (!message || message.length < 10) {
        showFieldError('message', 'El mensaje debe tener al menos 10 caracteres');
        isValid = false;
    }

    if (!isValid) showNotification('Por favor corrige los errores en el formulario', 'error');
    return isValid;
}

function validateField(field) {
    const { id, value } = field;
    const trimmed = value.trim();

    const validations = {
        name: () => trimmed.length >= 2,
        email: () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed),
        subject: () => trimmed.length >= 5,
        message: () => trimmed.length >= 10
    };

    if (!validations[id]?.()) {
        const messages = {
            name: 'El nombre debe tener al menos 2 caracteres',
            email: 'Por favor ingresa un email válido',
            subject: 'El asunto debe tener al menos 5 caracteres',
            message: 'El mensaje debe tener al menos 10 caracteres'
        };
        showFieldError(id, messages[id]);
        return false;
    }

    clearFieldError(field);
    return true;
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');

    formGroup?.querySelector('.field-error')?.remove();
    field.classList.add('error');

    const error = document.createElement('span');
    error.className = 'field-error';
    error.textContent = message;
    formGroup.appendChild(error);

    field.style.animation = 'shake 0.5s';
    setTimeout(() => (field.style.animation = ''), 500);
}

function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    formGroup?.querySelector('.field-error')?.remove();
    field.classList.remove('error');
}

// ============= ENVÍO =============

function submitForm(formData) {
    setTimeout(() => {
        hideLoadingState();
        if (Math.random() > 0.1) {
            handleFormSuccess(formData);
        } else {
            handleFormError('Error del servidor. Por favor intenta nuevamente.');
        }
    }, 2000);
}

function handleFormSuccess(formData) {
    showNotification('¡Mensaje enviado exitosamente! Te responderemos pronto.', 'success');
    document.querySelector('.contact-form').reset();
    saveContactToHistory(formData);

    const form = document.querySelector('.contact-form');
    form.style.transform = 'scale(0.98)';
    form.style.opacity = '0.8';
    setTimeout(() => {
        form.style.transform = 'scale(1)';
        form.style.opacity = '1';
    }, 300);
}

function handleFormError(message) {
    showNotification(message, 'error');
}

function showLoadingState() {
    const btn = document.querySelector('.submit-btn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        btn.style.opacity = '0.7';
    }
}

function hideLoadingState() {
    const btn = document.querySelector('.submit-btn');
    if (btn) {
        btn.disabled = false;
        btn.innerHTML = 'Enviar Mensaje';
        btn.style.opacity = '1';
    }
}

// ============= NOTIFICACIONES =============

function showNotification(message, type = 'info') {
    document.querySelector('.notification')?.remove();

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
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => closeNotification(notification), 5000);
}

const getNotificationIcon = (type) => ({
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
}[type] || 'fa-info-circle');

function closeNotification(el) {
    const notification = el.closest('.notification');
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
}

// ============= ANIMACIONES =============

function setupAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('animate-in'));
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.contact-info, .contact-form').forEach(el => {
        el.classList.add('animate-element');
        observer.observe(el);
    });

    animateContactInfo();
}

function animateContactInfo() {
    document.querySelectorAll('.info-section').forEach((el, i) => {
        el.style.animationDelay = `${i * 0.2}s`;
        el.classList.add('fade-in-up');
    });
}

// ============= INTERACTIVOS =============

function setupInteractiveElements() {
    document.querySelectorAll('.info-section').forEach(section => {
        section.addEventListener('mouseenter', () => {
            section.style.transform = 'translateY(-5px) scale(1.02)';
            section.style.boxShadow = '0 10px 30px rgba(124, 58, 237, 0.2)';
        });
        section.addEventListener('mouseleave', () => {
            section.style.transform = 'translateY(0) scale(1)';
            section.style.boxShadow = 'none';
        });
    });

    setupCopyToClipboard();
    setupInputEffects();
}

function setupCopyToClipboard() {
    document.querySelectorAll('.info-section p').forEach(el => {
        const text = el.textContent.trim();
        if (/@|\+|Calle/.test(text)) {
            el.style.cursor = 'pointer';
            el.title = 'Click para copiar';
            el.addEventListener('click', function () {
                navigator.clipboard.writeText(text).then(() => {
                    showNotification(`Copiado: ${text}`, 'success');
                    this.style.background = 'rgba(6, 255, 165, 0.2)';
                    setTimeout(() => (this.style.background = 'transparent'), 500);
                });
            });
        }
    });
}

function setupInputEffects() {
    document.querySelectorAll('.contact-form input, .contact-form textarea').forEach(input => {
        const group = input.parentElement;

        input.addEventListener('focus', () => group.classList.add('focused'));
        input.addEventListener('blur', () => !input.value && group.classList.remove('focused'));

        if (input.tagName === 'TEXTAREA') {
            const counter = document.createElement('span');
            counter.className = 'char-counter';
            group.appendChild(counter);

            input.addEventListener('input', () => {
                const count = input.value.length;
                counter.textContent = `${count}/500`;
                counter.style.color = count > 500 ? '#f5576c' : '#B8BCC8';
            });
        }
    });
}

// ============= HISTORIAL SIMULADO =============

function saveContactToHistory(formData) {
    const history = JSON.parse(localStorage.getItem('contactHistory') || '[]');
    history.unshift({ ...formData, timestamp: new Date().toISOString(), id: Date.now() });
    history.splice(10);
    localStorage.setItem('contactHistory', JSON.stringify(history));
}
