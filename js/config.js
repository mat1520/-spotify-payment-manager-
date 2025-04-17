// Configuración de MongoDB
const DB_PASSWORD = process.env.DB_PASSWORD; // La contraseña se manejará como variable de entorno
const MONGODB_URI = `mongodb+srv://Mat1520:${DB_PASSWORD}@cluster0.so39idr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Configuración de la aplicación
const config = {
    mongodb: {
        uri: MONGODB_URI,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }
};

export default config; 