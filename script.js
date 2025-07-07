// Variables globales
let selectedPlan = null;

// Función para scroll suave a secciones
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Función para seleccionar plan
function selectPlan(planId) {
    selectedPlan = planId;
    
    // Actualizar el formulario con el plan seleccionado
    const tipoClienteSelect = document.getElementById('tipoCliente');
    const presupuestoSelect = document.getElementById('presupuesto');
    
    // Determinar tipo de cliente y presupuesto basado en el plan
    switch(planId) {
        case 'revendedor-basico':
            tipoClienteSelect.value = 'revendedor';
            presupuestoSelect.value = 'hasta-7999';
            break;
        case 'revendedor-intermedio':
            tipoClienteSelect.value = 'revendedor';
            presupuestoSelect.value = '8000-14999';
            break;
        case 'revendedor-premium':
            tipoClienteSelect.value = 'revendedor';
            presupuestoSelect.value = '15000-mas';
            break;
        case 'particular-basico':
            tipoClienteSelect.value = 'particular';
            presupuestoSelect.value = 'hasta-7999';
            break;
        case 'particular-intermedio':
            tipoClienteSelect.value = 'particular';
            presupuestoSelect.value = '8000-14999';
            break;
        case 'particular-premium':
            tipoClienteSelect.value = 'particular';
            presupuestoSelect.value = '15000-mas';
            break;
    }
    
    // Scroll al formulario
    scrollToSection('formulario');
    
    // Mostrar mensaje de plan seleccionado
    showNotification(`Plan seleccionado: ${getPlanName(planId)}`, 'success');
}

// Función para obtener el nombre del plan
function getPlanName(planId) {
    const planNames = {
        'revendedor-basico': 'Revendedor Básico ($150)',
        'revendedor-intermedio': 'Revendedor Intermedio ($280)',
        'revendedor-premium': 'Revendedor Premium ($359)',
        'particular-basico': 'Particular Básico ($199)',
        'particular-intermedio': 'Particular Intermedio ($359)',
        'particular-premium': 'Particular Premium ($499)'
    };
    return planNames[planId] || 'Plan desconocido';
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(45deg, #059669, #10b981)' : 'linear-gradient(45deg, #dc2626, #ef4444)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 1500;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: bold;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Función para obtener la fecha mínima (hoy)
function getMinDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Función para obtener la fecha máxima (3 meses desde hoy)
function getMaxDate() {
    const today = new Date();
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
    return maxDate.toISOString().split('T')[0];
}

// Función para validar si la fecha es un día laboral
function isWeekday(dateString) {
    const date = new Date(dateString);
    const day = date.getDay();
    return day !== 0 && day !== 6; // 0 = Domingo, 6 = Sábado
}

// Función para formatear fecha para mostrar
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', options);
}

// Función para formatear hora para mostrar
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Validaciones del formulario
const validationRules = {
    nombre: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        message: 'El nombre debe contener solo letras y tener al menos 2 caracteres'
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Ingresa un correo electrónico válido'
    },
    telefono: {
        required: true,
        pattern: /^[\+]?[0-9\s\-$$$$]{10,}$/,
        message: 'Ingresa un número de teléfono válido (mínimo 10 dígitos)'
    },
    ciudad: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        message: 'La ciudad debe contener solo letras y tener al menos 2 caracteres'
    },
    tipoCliente: {
        required: true,
        message: 'Selecciona el tipo de cliente'
    },
    presupuesto: {
        required: true,
        message: 'Selecciona tu rango de presupuesto'
    },
    tipoVehiculo: {
        required: true,
        minLength: 3,
        message: 'Especifica el tipo de vehículo que buscas'
    },
    fechaCita: {
        required: true,
        message: 'Selecciona una fecha para la cita'
    },
    horaCita: {
        required: true,
        message: 'Selecciona una hora para la cita'
    },
    terminos: {
        required: true,
        message: 'Debes aceptar los términos y condiciones'
    }
};

// Función para validar un campo individual
function validateField(fieldName, value) {
    const rules = validationRules[fieldName];
    if (!rules) return { isValid: true };
    
    // Validar campo requerido
    if (rules.required && (!value || value.toString().trim() === '')) {
        return {
            isValid: false,
            message: `Este campo es obligatorio`
        };
    }
    
    // Si el campo está vacío y no es requerido, es válido
    if (!value || value.toString().trim() === '') {
        return { isValid: true };
    }
    
    // Validaciones específicas para fecha
    if (fieldName === 'fechaCita') {
        const today = getMinDate();
        const maxDate = getMaxDate();
        
        if (value < today) {
            return {
                isValid: false,
                message: 'La fecha no puede ser anterior a hoy'
            };
        }
        
        if (value > maxDate) {
            return {
                isValid: false,
                message: 'La fecha no puede ser mayor a 3 meses'
            };
        }
        
        if (!isWeekday(value)) {
            return {
                isValid: false,
                message: 'Por favor selecciona un día laboral (Lunes a Viernes)'
            };
        }
    }
    
    // Validar longitud mínima
    if (rules.minLength && value.length < rules.minLength) {
        return {
            isValid: false,
            message: rules.message || `Debe tener al menos ${rules.minLength} caracteres`
        };
    }
    
    // Validar patrón
    if (rules.pattern && !rules.pattern.test(value)) {
        return {
            isValid: false,
            message: rules.message || 'Formato inválido'
        };
    }
    
    return { isValid: true };
}

// Función para mostrar error en un campo
function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const formGroup = field.closest('.form-group');
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    formGroup.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

// Función para limpiar error de un campo
function clearFieldError(fieldName) {
    const field = document.getElementById(fieldName);
    const formGroup = field.closest('.form-group');
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    formGroup.classList.remove('error');
    errorElement.textContent = '';
    errorElement.classList.remove('show');
}

// Función para validar todo el formulario
function validateForm() {
    let isFormValid = true;
    const formData = new FormData(document.getElementById('contactForm'));
    
    // Limpiar errores previos
    Object.keys(validationRules).forEach(fieldName => {
        clearFieldError(fieldName);
    });
    
    // Validar cada campo
    Object.keys(validationRules).forEach(fieldName => {
        let value;
        
        if (fieldName === 'terminos') {
            value = document.getElementById(fieldName).checked;
        } else {
            value = formData.get(fieldName);
        }
        
        const validation = validateField(fieldName, value);
        
        if (!validation.isValid) {
            showFieldError(fieldName, validation.message);
            isFormValid = false;
        }
    });
    
    return isFormValid;
}

// La URL de tu Google Apps Script desplegado (¡REEMPLAZA ESTO CON TU URL REAL!)
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzwGSlnf1Gqm4soK9LRqcYNbQC4X8_EhZ0k3ltF4xxISDlYbbKnKq523zU3UtS4kf-e8w/exec'; // <-- ¡IMPORTANTE: PEGA TU URL AQUÍ!

// Función para enviar el formulario a Google Sheets
async function submitForm(formData) {
    // Convertir FormData a un objeto plano para la URLSearchParams
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    try {
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            // 'no-cors' es necesario cuando se envía a Google Apps Script
            // porque el navegador no puede leer la respuesta CORS de un origen diferente
            mode: 'no-cors',
            headers: {
                // Usamos 'application/x-www-form-urlencoded' porque es el formato que doPost espera por defecto
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            // Codificamos los datos como una cadena de consulta URL
            body: new URLSearchParams(data).toString(),
        });

        // NOTA: Con 'mode: no-cors', la respuesta del fetch será opaca,
        // lo que significa que no podemos ver el 'result: "success"' o 'message'
        // que devuelve el Apps Script. Asumimos que si no hay un error de red
        // en el lado del cliente, el envío al Apps Script fue exitoso.
        if (response.ok || response.type === 'opaque') {
            console.log('Formulario enviado a Google Sheets (respuesta opaca).');
            return { success: true };
        } else {
            // Esto solo se ejecutará si hay un error de red, no un error del Apps Script
            console.error('Error HTTP:', response.status, response.statusText);
            throw new Error(`Error en el envío HTTP: ${response.status}`);
        }
    } catch (error) {
        console.error('Error al enviar el formulario a Google Sheets:', error);
        throw new Error('No se pudo conectar con el servicio de Google Sheets. Inténtalo de nuevo.');
    }
}

// Función para mostrar el modal de éxito
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    const fechaCita = document.getElementById('fechaCita').value;
    const horaCita = document.getElementById('horaCita').value;
    
    // Actualizar información de la cita en el modal
    document.getElementById('citaFecha').textContent = formatDate(fechaCita);
    document.getElementById('citaHora').textContent = formatTime(horaCita);
    
    modal.style.display = 'block';
    
    // Cerrar modal al hacer clic fuera de él
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Función para cerrar el modal
function closeModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
}

// Event listeners cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitButton = form.querySelector('.submit-button');
    const fechaCitaInput = document.getElementById('fechaCita');
    
    // Configurar límites de fecha
    fechaCitaInput.min = getMinDate();
    fechaCitaInput.max = getMaxDate();
    
    // Validación en tiempo real
    Object.keys(validationRules).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('blur', function() {
                let value;
                if (fieldName === 'terminos') {
                    value = field.checked;
                } else {
                    value = field.value;
                }
                
                const validation = validateField(fieldName, value);
                
                if (!validation.isValid) {
                    showFieldError(fieldName, validation.message);
                } else {
                    clearFieldError(fieldName);
                }
            });
            
            // Limpiar error mientras el usuario escribe
            if (fieldName !== 'terminos') {
                field.addEventListener('input', function() {
                    if (field.closest('.form-group').classList.contains('error')) {
                        clearFieldError(fieldName);
                    }
                });
            }
        }
    });
    
    // Manejar envío del formulario
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            showNotification('Por favor corrige los errores en el formulario', 'error');
            return;
        }
        
        // Deshabilitar botón de envío
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        
        try {
            const formData = new FormData(form);
            
            // Agregar plan seleccionado si existe
            if (selectedPlan) {
                formData.append('planSeleccionado', selectedPlan);
            }
            
            const result = await submitForm(formData);
            
            if (result.success) {
                showSuccessModal();
                form.reset();
                selectedPlan = null;
                
                // Reconfigurar límites de fecha después del reset
                fechaCitaInput.min = getMinDate();
                fechaCitaInput.max = getMaxDate();
            }
        } catch (error) {
            console.error('Error al enviar formulario:', error);
            showNotification('Error al enviar el formulario. Inténtalo de nuevo.', 'error');
        } finally {
            // Rehabilitar botón de envío
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> 🚀 Enviar Solicitud';
        }
    });
    
    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Smooth scroll para enlaces de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    // Animaciones al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = '0s';
                entry.target.style.animationFillMode = 'both';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animaciones
    document.querySelectorAll('.service-card, .pricing-card, .process-step, .testimonial-card').forEach(el => {
        observer.observe(el);
    });
});

// Función para manejar el redimensionamiento de la ventana
window.addEventListener('resize', function() {
    // Ajustar elementos si es necesario
    const modal = document.getElementById('successModal');
    if (modal.style.display === 'block') {
        // Recentrar modal si está abierto
        modal.style.display = 'block';
    }
});

// Prevenir envío de formulario con Enter en campos de texto
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type === 'text') {
        e.preventDefault();
    }
});