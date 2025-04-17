import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const DB_PASSWORD = process.env.DB_PASSWORD;
const MONGODB_URI = `mongodb+srv://Mat1520:${DB_PASSWORD}@cluster0.so39idr.mongodb.net/?retryWrites=true&w=majority`;
const DB_NAME = 'spotify';
const COLLECTION_NAME = 'cards';

// Función para conectar a MongoDB
async function connectToDatabase() {
    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        console.log('Conectado a MongoDB Atlas');
        return client;
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        throw error;
    }
}

export default async function handler(req, res) {
    const { method } = req;
    let client;

    try {
        client = await connectToDatabase();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        switch (method) {
            case 'GET':
                // Listar tarjetas
                const cards = await collection.find({}).toArray();
                res.status(200).json(cards);
                break;

            case 'POST':
                // Agregar nueva tarjeta
                const { cardNumber, expiryDate, cvv } = req.body;
                
                // Validaciones básicas
                if (!cardNumber || !expiryDate || !cvv) {
                    res.status(400).json({ error: 'Faltan campos requeridos' });
                    return;
                }

                const newCard = {
                    cardNumber: cardNumber.replace(/\s/g, ''),
                    expiryDate,
                    cvv,
                    status: 'pending',
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                const result = await collection.insertOne(newCard);
                console.log('Tarjeta guardada:', result);
                res.status(201).json({ success: true, message: 'Tarjeta guardada exitosamente' });
                break;

            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) {
        console.error('Error en el handler:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud: ' + error.message });
    } finally {
        if (client) {
            await client.close();
        }
    }
} 