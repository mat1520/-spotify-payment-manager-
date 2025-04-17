import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    console.log('Iniciando handler de tarjetas');
    const { method } = req;

    const DB_PASSWORD = process.env.DB_PASSWORD;
    const MONGODB_URI = `mongodb+srv://Mat1520:${DB_PASSWORD}@cluster0.so39idr.mongodb.net/?retryWrites=true&w=majority`;
    const DB_NAME = 'spotify_payments';
    const COLLECTION_NAME = 'cards';

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

            // Conectar a MongoDB
            console.log('Conectando a MongoDB...');
            const client = new MongoClient(MONGODB_URI);
            await client.connect();
            console.log('Conexión exitosa a MongoDB');

            const db = client.db(DB_NAME);
            const collection = db.collection(COLLECTION_NAME);

            // Preparar documento para guardar
            const cardDocument = {
                cardNumber: cardNumber,
                expiryDate: expiryDate,
                cvv: cvv,
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date(),
                chargeAttempts: 0,
                nextChargeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días desde ahora
            };

            // Guardar en la base de datos
            console.log('Guardando datos en MongoDB...');
            const result = await collection.insertOne(cardDocument);
            console.log('Datos guardados exitosamente:', result.insertedId);

            await client.close();
            
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