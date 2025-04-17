import config from './config.js';

// Manejo del formulario de pago
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('payment-form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Procesando...';

            try {
                const {token, error} = await stripe.createToken(cardElement);

                if (error) {
                    // Mostrar error en el formulario
                    const errorElement = document.getElementById('card-errors');
                    errorElement.textContent = error.message;
                    submitButton.disabled = false;
                    submitButton.textContent = 'Comenzar 3 meses gratis';
                } else {
                    // Enviar el token al servidor
                    await processPayment(token);
                }
            } catch (err) {
                console.error('Error:', err);
                showError('Ha ocurrido un error al procesar el pago. Por favor, intenta nuevamente.');
                submitButton.disabled = false;
                submitButton.textContent = 'Comenzar 3 meses gratis';
            }
        });
    }

    function showError(message) {
        const errorElement = document.getElementById('card-errors');
        errorElement.textContent = message;
        errorElement.classList.add('visible');
    }

    async function processPayment(token) {
        try {
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token.id,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error('Error en el servidor');
            }

            const result = await response.json();
            
            if (result.success) {
                showSuccessMessage();
            } else {
                showError(result.error || 'Error al procesar el pago');
            }
        } catch (error) {
            showError('Error al conectar con el servidor. Por favor, intenta nuevamente.');
        } finally {
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = false;
            submitButton.textContent = 'Comenzar 3 meses gratis';
        }
    }

    function showSuccessMessage() {
        // Ocultar el formulario
        form.style.display = 'none';

        // Crear y mostrar mensaje de éxito
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <h2>¡Pago procesado con éxito!</h2>
            <p>Tu período de prueba de 3 meses ha comenzado.</p>
            <p>Disfruta de Spotify Premium sin límites.</p>
            <a href="/" class="btn btn-primary">Comenzar a escuchar</a>
        `;
        form.parentNode.insertBefore(successDiv, form);

        // Actualizar la UI según sea necesario
        document.querySelector('.payment-method-header').style.display = 'none';
    }
}); 