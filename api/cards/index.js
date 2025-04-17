import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    console.log('Iniciando handler de tarjetas');
    const { method } = req;

    try {
        if (method === 'POST') {
            const { cardNumber, expiryDate, cvv } = req.body;
            console.log('Datos recibidos:', {
                cardNumber: cardNumber ? '****' : 'no proporcionado',
                expiryDate: expiryDate ? 'proporcionado' : 'no proporcionado',
                cvv: cvv ? '***' : 'no proporcionado'
            });

            // Validaciones básicas
            if (!cardNumber || !expiryDate || !cvv) {
                return res.status(400).json({
                    success: false,
                    message: 'Faltan campos requeridos'
                });
            }

            // Simular guardado exitoso
            console.log('Guardado simulado exitoso');
            
            return res.status(200).json({
                success: true,
                message: 'Tarjeta guardada exitosamente',
                redirectUrl: '/index.html'
            });
        }

        // Si no es POST, devolver error
        return res.status(405).json({
            success: false,
            message: 'Método no permitido'
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
} 