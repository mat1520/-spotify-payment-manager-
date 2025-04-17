import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const DB_PASSWORD = process.env.DB_PASSWORD;
const MONGODB_URI = `mongodb+srv://Mat1520:${DB_PASSWORD}@cluster0.so39idr.mongodb.net/?retryWrites=true&w=majority`;
const DB_NAME = 'spotify_payments';
const COLLECTION_NAME = 'cards';

async function connectToDatabase() {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    return client;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    try {
        const client = await connectToDatabase();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        const { cardId, chargeSuccessful, notes } = req.body;

        if (!cardId) {
            res.status(400).json({ error: 'ID de tarjeta requerido' });
            return;
        }

        const card = await collection.findOne({ _id: new ObjectId(cardId) });

        if (!card) {
            res.status(404).json({ error: 'Tarjeta no encontrada' });
            return;
        }

        const update = {
            $set: {
                updatedAt: new Date(),
                lastChargeDate: new Date(),
                nextChargeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Próximo cobro en 30 días
            },
            $inc: { chargeAttempts: 1 }
        };

        if (notes) {
            update.$set.notes = notes;
        }

        if (chargeSuccessful) {
            update.$set.status = 'active';
        } else {
            // Si el cobro falló y ya hay 3 intentos, marcar como cancelled
            if (card.chargeAttempts >= 2) { // Ya va a ser el tercer intento
                update.$set.status = 'cancelled';
            }
        }

        const result = await collection.updateOne(
            { _id: new ObjectId(cardId) },
            update
        );

        res.status(200).json({
            success: true,
            message: chargeSuccessful ? 'Cobro registrado con éxito' : 'Intento de cobro registrado',
            result
        });

        await client.close();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al procesar el cobro' });
    }
} 