import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    console.log('Iniciando handler de tarjetas');
    const { method } = req;

    try {
        // Verificar la variable de entorno
        const DB_PASSWORD = process.env.DB_PASSWORD;
        console.log('DB_PASSWORD presente:', !!DB_PASSWORD);
        
        if (!DB_PASSWORD) {
            throw new Error('La variable de entorno DB_PASSWORD no está configurada');
        }

        const MONGODB_URI = `mongodb+srv://Mat1520:${DB_PASSWORD}@cluster0.so39idr.mongodb.net/?retryWrites=true&w=majority`;
        console.log('URI de MongoDB generada (parcial):', MONGODB_URI.substring(0, 35) + '...');

        if (method === 'POST') {
            const { cardNumber, expiryDate, cvv } = req.body;
            console.log('Datos recibidos:', {
                cardNumber: cardNumber ? cardNumber.slice(-4) : 'no proporcionado',
                expiryDate: expiryDate || 'no proporcionado',
                cvv: cvv ? '***' : 'no proporcionado'
            });

            // Validaciones básicas
            if (!cardNumber || !expiryDate || !cvv) {
                console.log('Error: Faltan campos requeridos');
                return res.status(400).json({
                    success: false,
                    message: 'Faltan campos requeridos'
                });
            }

            let client;
            try {
                // Conectar a MongoDB
                console.log('Intentando conectar a MongoDB...');
                client = new MongoClient(MONGODB_URI, {
                    connectTimeoutMS: 10000,
                    socketTimeoutMS: 10000
                });
                await client.connect();
                console.log('Conexión exitosa a MongoDB');

                const db = client.db('spotify_payments');
                const collection = db.collection('cards');

                // Preparar documento para guardar
                const cardDocument = {
                    cardNumber: cardNumber.slice(-4), // Solo guardamos los últimos 4 dígitos
                    expiryDate: expiryDate,
                    cvv: '***', // No guardamos el CVV real por seguridad
                    status: 'pending',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    chargeAttempts: 0,
                    nextChargeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                };

                // Guardar en la base de datos
                console.log('Intentando guardar datos en MongoDB...');
                const result = await collection.insertOne(cardDocument);
                console.log('Datos guardados exitosamente. ID:', result.insertedId);

                return res.status(200).json({
                    success: true,
                    message: 'Tarjeta guardada exitosamente',
                    redirectUrl: '/index.html'
                });
            } catch (dbError) {
                console.error('Error de MongoDB:', dbError);
                throw new Error(`Error al conectar con la base de datos: ${dbError.message}`);
            } finally {
                if (client) {
                    console.log('Cerrando conexión con MongoDB...');
                    await client.close();
                }
            }
        }

        // Si no es POST, devolver error
        console.log(`Método no permitido: ${method}`);
        return res.status(405).json({
            success: false,
            message: 'Método no permitido'
        });

    } catch (error) {
        console.error('Error general:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al guardar los datos de la tarjeta',
            error: error.message
        });
    }
} 