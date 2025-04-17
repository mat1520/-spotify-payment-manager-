import { MongoClient } from 'mongodb';

const DB_PASSWORD = 'Matias2004';
const MONGODB_URI = `mongodb+srv://Mat1520:${DB_PASSWORD}@cluster0.so39idr.mongodb.net/?retryWrites=true&w=majority`;

async function testConnection() {
    let client;
    try {
        console.log('Intentando conectar a MongoDB...');
        client = new MongoClient(MONGODB_URI, {
            connectTimeoutMS: 5000,
            socketTimeoutMS: 5000,
            serverSelectionTimeoutMS: 5000
        });
        
        await client.connect();
        console.log('¡Conexión exitosa!');
        
        const db = client.db('spotify_payments');
        const collections = await db.listCollections().toArray();
        console.log('Colecciones disponibles:', collections);
        
        const testDoc = {
            test: true,
            timestamp: new Date()
        };
        
        const result = await db.collection('test').insertOne(testDoc);
        console.log('Documento de prueba insertado:', result.insertedId);
        
    } catch (error) {
        console.error('Error detallado:', {
            name: error.name,
            message: error.message,
            code: error.code,
            stack: error.stack
        });
    } finally {
        if (client) {
            console.log('Cerrando conexión...');
            await client.close();
        }
    }
}

testConnection(); 