import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    console.log('Iniciando handler de tarjetas');
    const { method } = req;
    let client;

    try {
        console.log('Método:', method);
        console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? 'Configurado' : 'No configurado');
        
        const uri = `mongodb+srv://Mat1520:${process.env.DB_PASSWORD}@cluster0.so39idr.mongodb.net/?retryWrites=true&w=majority`;
        console.log('URI de MongoDB (parcial):', uri.substring(0, 40) + '...');

        client = new MongoClient(uri);
        console.log('Cliente MongoDB creado');

        await client.connect();
        console.log('Conexión establecida');

        const db = client.db('spotify_payments');
        const collection = db.collection('cards');
        console.log('Colección seleccionada');

        if (method === 'POST') {
            console.log('Procesando POST');
            console.log('Body recibido:', JSON.stringify(req.body));

            const { cardNumber, expiryDate, cvv } = req.body;

            if (!cardNumber || !expiryDate || !cvv) {
                console.log('Faltan campos:', { cardNumber: !!cardNumber, expiryDate: !!expiryDate, cvv: !!cvv });
                return res.status(400).json({ error: 'Faltan campos requeridos' });
            }

            const newCard = {
                cardNumber: cardNumber.replace(/\s/g, ''),
                expiryDate,
                cvv,
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            console.log('Intentando guardar:', { ...newCard, cardNumber: '****' });
            const result = await collection.insertOne(newCard);
            console.log('Resultado:', result);

            return res.status(201).json({ 
                success: true, 
                message: 'Tarjeta guardada exitosamente',
                id: result.insertedId
            });
        }

        if (method === 'GET') {
            const cards = await collection.find({}).toArray();
            return res.status(200).json(cards);
        }

        return res.status(405).json({ error: `Método ${method} no permitido` });

    } catch (error) {
        console.error('Error completo:', error);
        return res.status(500).json({ 
            error: 'Error al procesar la solicitud',
            message: error.message,
            type: error.name,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    } finally {
        if (client) {
            try {
                await client.close();
                console.log('Conexión cerrada');
            } catch (closeError) {
                console.error('Error al cerrar la conexión:', closeError);
            }
        }
    }
} 