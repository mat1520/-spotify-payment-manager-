import { MongoClient } from 'mongodb';

const DB_PASSWORD = 'tu_password_aqui';
const MONGODB_URI = `mongodb+srv://Mat1520:${DB_PASSWORD}@cluster0.so39idr.mongodb.net/?retryWrites=true&w=majority`;

async function testConnection() {
    const client = new MongoClient(MONGODB_URI);
    try {
        console.log('Intentando conectar a MongoDB...');
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
        console.error('Error al conectar:', error);
    } finally {
        await client.close();
    }
}

testConnection(); 