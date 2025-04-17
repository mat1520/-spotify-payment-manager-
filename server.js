import express from 'express';
import bodyParser from 'body-parser';
import { connectDB, saveCard } from './js/db.js';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('.'));

// Conectar a MongoDB al iniciar el servidor
connectDB().catch(console.error);

// Ruta para guardar los datos de la tarjeta
app.post('/api/cards', async (req, res) => {
    try {
        const result = await saveCard(req.body);
        res.json({ success: true, message: 'Tarjeta guardada exitosamente' });
    } catch (error) {
        console.error('Error al guardar la tarjeta:', error);
        res.status(500).json({ success: false, error: 'Error al guardar los datos de la tarjeta' });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
}); 