import supabase from '../../lib/supabase';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Método no permitido'
        });
    }

    try {
        const { cardNumber, expiryDate, cvv } = req.body;

        // Validaciones básicas
        if (!cardNumber || !expiryDate || !cvv) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos'
            });
        }

        // Preparar datos para guardar
        const cardData = {
            card_number: '*'.repeat(12) + cardNumber.slice(-4),
            last_four: cardNumber.slice(-4),
            expiry_date: expiryDate,
            created_at: new Date().toISOString(),
            status: 'pending'
        };

        // Guardar en Supabase
        const { data, error } = await supabase
            .from('cards')
            .insert([cardData]);

        if (error) {
            console.error('Error de Supabase:', error);
            throw new Error('Error al guardar la tarjeta');
        }

        return res.status(200).json({
            success: true,
            message: 'Tarjeta guardada correctamente',
            data: {
                id: data[0].id,
                last_four: cardData.last_four
            }
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error al procesar la solicitud'
        });
    }
} 