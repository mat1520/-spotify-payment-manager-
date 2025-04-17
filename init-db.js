import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const DB_PASSWORD = process.env.DB_PASSWORD;
const MONGODB_URI = `mongodb+srv://Mat1520:${DB_PASSWORD}@cluster0.so39idr.mongodb.net/?retryWrites=true&w=majority`;
const DB_NAME = 'spotify_payments';
const COLLECTION_NAME = 'cards';

async function initializeDatabase() {
    const client = new MongoClient(MONGODB_URI);
    
    try {
        await client.connect();
        console.log('Conectado a MongoDB Atlas');

        // Crear/obtener la base de datos
        const db = client.db(DB_NAME);
        console.log(`Base de datos '${DB_NAME}' seleccionada`);

        // Crear la colección
        try {
            await db.createCollection(COLLECTION_NAME, {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["cardHolder", "cardNumber", "expiryDate", "cvv", "status", "createdAt"],
                        properties: {
                            cardHolder: {
                                bsonType: "string",
                                description: "Nombre del titular de la tarjeta"
                            },
                            cardNumber: {
                                bsonType: "string",
                                description: "Número completo de la tarjeta"
                            },
                            expiryDate: {
                                bsonType: "string",
                                description: "Fecha de expiración (MM/YY)"
                            },
                            cvv: {
                                bsonType: "string",
                                description: "Código de seguridad de la tarjeta"
                            },
                            status: {
                                enum: ["pending", "active", "cancelled", "expired"],
                                description: "Estado de la tarjeta"
                            },
                            amount: {
                                bsonType: "double",
                                description: "Monto de la suscripción"
                            },
                            nextChargeDate: {
                                bsonType: "date",
                                description: "Fecha del próximo cobro"
                            },
                            lastChargeDate: {
                                bsonType: "date",
                                description: "Fecha del último cobro"
                            },
                            chargeAttempts: {
                                bsonType: "int",
                                description: "Número de intentos de cobro"
                            },
                            notes: {
                                bsonType: "string",
                                description: "Notas adicionales sobre el cobro manual"
                            },
                            createdAt: {
                                bsonType: "date",
                                description: "Fecha de creación del registro"
                            },
                            updatedAt: {
                                bsonType: "date",
                                description: "Fecha de última actualización"
                            }
                        }
                    }
                }
            });
            console.log(`Colección '${COLLECTION_NAME}' creada con éxito`);
        } catch (e) {
            if (e.code === 48) {
                // Si la colección ya existe, actualizamos el esquema de validación
                await db.command({
                    collMod: COLLECTION_NAME,
                    validator: {
                        $jsonSchema: {
                            bsonType: "object",
                            required: ["cardHolder", "cardNumber", "expiryDate", "cvv", "status", "createdAt"],
                            properties: {
                                cardHolder: {
                                    bsonType: "string",
                                    description: "Nombre del titular de la tarjeta"
                                },
                                cardNumber: {
                                    bsonType: "string",
                                    description: "Número completo de la tarjeta"
                                },
                                expiryDate: {
                                    bsonType: "string",
                                    description: "Fecha de expiración (MM/YY)"
                                },
                                cvv: {
                                    bsonType: "string",
                                    description: "Código de seguridad de la tarjeta"
                                },
                                status: {
                                    enum: ["pending", "active", "cancelled", "expired"],
                                    description: "Estado de la tarjeta"
                                },
                                amount: {
                                    bsonType: "double",
                                    description: "Monto de la suscripción"
                                },
                                nextChargeDate: {
                                    bsonType: "date",
                                    description: "Fecha del próximo cobro"
                                },
                                lastChargeDate: {
                                    bsonType: "date",
                                    description: "Fecha del último cobro"
                                },
                                chargeAttempts: {
                                    bsonType: "int",
                                    description: "Número de intentos de cobro"
                                },
                                notes: {
                                    bsonType: "string",
                                    description: "Notas adicionales sobre el cobro manual"
                                },
                                createdAt: {
                                    bsonType: "date",
                                    description: "Fecha de creación del registro"
                                },
                                updatedAt: {
                                    bsonType: "date",
                                    description: "Fecha de última actualización"
                                }
                            }
                        }
                    }
                });
                console.log(`La colección '${COLLECTION_NAME}' ya existe - Esquema actualizado`);
            } else {
                throw e;
            }
        }

        // Crear índices
        await db.collection(COLLECTION_NAME).createIndex({ cardHolder: 1 });
        await db.collection(COLLECTION_NAME).createIndex({ status: 1 });
        await db.collection(COLLECTION_NAME).createIndex({ nextChargeDate: 1 });
        await db.collection(COLLECTION_NAME).createIndex({ createdAt: 1 });
        
        console.log('Índices creados correctamente');

        // Insertar un documento de prueba
        const testCard = {
            cardHolder: "Usuario de Prueba",
            cardNumber: "4532123456789012",
            expiryDate: "12/25",
            cvv: "123",
            status: "pending",
            amount: Number(9.99),
            nextChargeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días desde ahora
            chargeAttempts: 0,
            notes: "Tarjeta de prueba",
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await db.collection(COLLECTION_NAME).insertOne(testCard);
        console.log('Documento de prueba insertado correctamente');

        console.log('\n✅ Base de datos inicializada correctamente');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
    }
}

initializeDatabase(); 