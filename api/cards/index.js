import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    console.log('Iniciando handler de tarjetas');
    const { method } = req;

    // Verificar método HTTP
    if (method !== 'POST') {
        console.log(`Método no permitido: ${method}`);
        return res.status(405).json({
            success: false,
            message: `Método ${method} no permitido`
        });
    }

    let client;
    try {
        // 1. Validar datos de entrada
        const { cardNumber, expiryDate, cvv } = req.body;
        
        if (!cardNumber || !expiryDate || !cvv) {
            throw new Error('Faltan campos requeridos: cardNumber, expiryDate, o cvv');
        }

        if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
            throw new Error('Número de tarjeta inválido - debe tener 16 dígitos');
        }

        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            throw new Error('Fecha de vencimiento inválida - formato debe ser MM/YY');
        }

        if (!/^\d{3,4}$/.test(cvv)) {
            throw new Error('CVV inválido - debe tener 3 o 4 dígitos');
        }

        // 2. Configurar conexión MongoDB
        const DB_PASSWORD = process.env.DB_PASSWORD;
        if (!DB_PASSWORD) {
            throw new Error('Variable de entorno DB_PASSWORD no configurada');
        }

        const MONGODB_URI = `mongodb+srv://Mat1520:${DB_PASSWORD}@cluster0.so39idr.mongodb.net/?retryWrites=true&w=majority`;
        
        // 3. Conectar a MongoDB
        console.log('Conectando a MongoDB...');
        client = new MongoClient(MONGODB_URI, {
            connectTimeoutMS: 5000,
            socketTimeoutMS: 5000,
            serverSelectionTimeoutMS: 5000
        });

        await client.connect();
        console.log('Conexión exitosa a MongoDB');

        // 4. Preparar documento
        const db = client.db('spotify_payments');
        const collection = db.collection('cards');

        // Encriptar número de tarjeta (en producción deberías usar una mejor encriptación)
        const maskedCardNumber = cardNumber.replace(/\s/g, '');
        const lastFourDigits = maskedCardNumber.slice(-4);
        const encryptedCard = '*'.repeat(12) + lastFourDigits;

        const cardDocument = {
            cardNumber: encryptedCard,
            lastFourDigits: lastFourDigits,
            expiryDate: expiryDate,
            cvv: '***', // Nunca guardar el CVV real
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
            chargeAttempts: 0,
            nextChargeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
            metadata: {
                userAgent: req.headers['user-agent'],
                ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
            }
        };

        // 5. Guardar en MongoDB
        console.log('Guardando tarjeta en MongoDB...');
        const result = await collection.insertOne(cardDocument);
        
        if (!result.insertedId) {
            throw new Error('Error al insertar documento - no se generó ID');
        }

        console.log('Tarjeta guardada exitosamente. ID:', result.insertedId);

        // 6. Responder al cliente
        return res.status(200).json({
            success: true,
            message: 'Tarjeta guardada exitosamente',
            cardId: result.insertedId,
            lastFourDigits: lastFourDigits,
            redirectUrl: '/index.html'
        });

    } catch (error) {
        console.error('Error detallado:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });

        // Determinar tipo de error para mensaje apropiado
        let statusCode = 500;
        let errorMessage = 'Error interno del servidor';

        if (error.message.includes('Faltan campos') || 
            error.message.includes('inválido')) {
            statusCode = 400;
            errorMessage = error.message;
        } else if (error.name === 'MongoServerError') {
            errorMessage = 'Error de conexión con la base de datos';
        }

        return res.status(statusCode).json({
            success: false,
            message: errorMessage,
            error: error.message
        });

    } finally {
        if (client) {
            console.log('Cerrando conexión con MongoDB...');
            await client.close();
        }
    }
} 