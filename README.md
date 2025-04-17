# Spotify Payment Manager

Sistema de gestión de pagos manuales para suscripciones de Spotify.

## Características

- Gestión de tarjetas de crédito/débito
- Registro de cobros manuales
- Seguimiento de estados de pago
- API REST para integración

## Tecnologías

- Node.js
- MongoDB Atlas
- Vercel
- API Routes

## Variables de Entorno

Crear un archivo `.env` con:

```
DB_PASSWORD=tu_contraseña_mongodb
```

## Instalación

```bash
npm install
```

## Desarrollo Local

```bash
npm run dev
```

## API Endpoints

### GET /api/cards
Lista todas las tarjetas registradas

### POST /api/cards
Registra una nueva tarjeta

### POST /api/cards/charge
Registra un cobro manual
