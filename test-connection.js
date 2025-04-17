import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const DB_PASSWORD = process.env.DB_PASSWORD;
// Usando el formato exacto de la cadena de conexión de MongoDB Atlas
const MONGODB_URI = `mongodb+srv://Mat1520:${DB_PASSWORD}@cluster0.so39idr.mongodb.net/?retryWrites=true&w=majority`;

async function testConnection() {
    const client = new MongoClient(MONGODB_URI);
    
    try {
        console.log('Intentando conectar a MongoDB Atlas...');
        console.log('URI de conexión:', MONGODB_URI.replace(DB_PASSWORD, '****'));
        await client.connect();
        console.log('¡Conexión exitosa a MongoDB Atlas! ✅');
        
        // Listar las bases de datos disponibles
        const dbs = await client.db().admin().listDatabases();
        console.log('\nBases de datos disponibles:');
        dbs.databases.forEach(db => console.log(` - ${db.name}`));
        
    } catch (error) {
        console.error('❌ Error al conectar:', error.message);
        console.error('\nVerifica:');
        console.error('1. Que la contraseña en el archivo .env sea correcta');
        console.error('2. Que tu IP esté en la lista blanca de MongoDB Atlas');
        console.error('3. Que el usuario Mat1520 tenga los permisos correctos');
    } finally {
        await client.close();
    }
}

testConnection(); 