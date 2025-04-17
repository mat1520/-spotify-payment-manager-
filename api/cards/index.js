import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const DB_PASSWORD = process.env.DB_PASSWORD;
const MONGODB_URI = `mongodb+srv://Mat1520:${DB_PASSWORD}@cluster0.so39idr.mongodb.net/?retryWrites=true&w=majority`;
const DB_NAME = 'spotify_payments';
const COLLECTION_NAME = 'cards';

// Función para conectar a MongoDB
async function connectToDatabase() {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    return client;
}

export default async function handler(req, res) {
    const { method } = req;

    try {
        const client = await connectToDatabase();
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
                res.status(201).json({ success: true, message: 'Tarjeta guardada exitosamente' });
                break;

            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }

        await client.close();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
} 