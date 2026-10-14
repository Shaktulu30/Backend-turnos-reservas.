# Backend - Sistema de Turnos y Reservas

API REST para un sistema de turnos y reservas, hecha con Node.js, Express y módulos ESM. Gestiona dos recursos, `services` (servicios disponibles) y `bookings` (reservas), con persistencia en **MongoDB Atlas** mediante **Mongoose**.

El proyecto está organizado en una arquitectura en capas, separando responsabilidades de forma que la persistencia quede aislada en la capa más baja:

```
Cliente  ->  Ruta  ->  Controller  ->  Service  ->  Repository  ->  DAO  ->  MongoDB (Mongoose)
```

- **routes/**: definen los endpoints y los conectan con su controller (no tienen lógica).
- **controllers/**: leen `req.params` / `req.body`, llaman al service y arman la response (no tocan la base).
- **services/**: reglas de negocio (validaciones, defaults, coordinación entre recursos). No conocen `req`/`res` ni Mongoose.
- **repositories/**: envuelven al DAO (inyectado por constructor) y reenvían. Capa de abstracción sobre la persistencia.
- **dao/**: acceso a datos con Mongoose. Es la única capa que conoce la base de datos.
- **dao/models/**: schemas y models de Mongoose.

La conexión a MongoDB está centralizada y la instanciación de las capas se hace una sola vez en un *composition root* (`config/container.js`), que inyecta las dependencias (DAO → Repository → Service).

## Instalación

```bash
git clone <url-del-repo>
cd Backend-turnos-reservas
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz tomando como base `.env.example`:

- `PORT` — puerto de la aplicación (ej: 8080)
- `NODE_ENV` — entorno de ejecución (ej: development)
- `MONGO_URI` — string de conexión a MongoDB Atlas (ej: `mongodb+srv://usuario:password@cluster.mongodb.net/booking_system`)

La app **no arranca** si falta alguna de estas variables (validación fail-fast). El archivo `.env` **no se versiona** (está en `.gitignore`); `.env.example` sí, como guía.

## Ejecución

```bash
node src/server.js
```

Al arrancar, la app **primero conecta a MongoDB** y recién después levanta el servidor. Queda escuchando en `http://localhost:PORT`.

## Recurso: services

Cada servicio tiene esta forma:

```js
{ _id, name, description, duration, price, category, available, createdAt, updatedAt }
```

El `_id` lo genera MongoDB automáticamente (tipo `ObjectId`); no se envía en el body. `available` es opcional: si no se envía, toma `true` por defecto (definido en el schema). `createdAt` / `updatedAt` los agrega Mongoose vía `timestamps`.

### Endpoints de services

Base: `/api/services`

| Método | Ruta | Descripción | Éxito | Error |
|--------|------|-------------|-------|-------|
| GET | `/api/services` | Lista todos los servicios | 200 | — |
| GET | `/api/services/:sid` | Devuelve un servicio por id | 200 | 404 si no existe |
| POST | `/api/services` | Crea un servicio | 201 | 400 si faltan campos |
| PUT | `/api/services/:sid` | Actualiza un servicio | 200 | 404 si no existe |
| DELETE | `/api/services/:sid` | Elimina un servicio | 200 | 404 si no existe |

Ejemplo de body (POST / PUT):

```json
{
  "name": "Clase de spinning",
  "description": "Clase grupal de ciclismo indoor",
  "duration": 45,
  "price": 9000,
  "category": "grupal"
}
```

## Recurso: bookings

Una reserva guarda los datos del cliente y la lista de servicios asociados. Los servicios no se guardan completos: se **referencian por su `ObjectId`**, junto con la cantidad:

```js
{ service: "652f3a...", quantity: 1 }   // service = ObjectId del documento en la colección services
```

El `status` arranca en `"pending"` por defecto (schema, con `enum`). Al crear una reserva, la lista de servicios nace vacía y se completa con el endpoint de agregar servicio. Si se agrega un servicio que ya estaba en la reserva, no se duplica: se incrementa la `quantity`. Antes de agregarlo, se valida que el servicio exista en `services`.

### Endpoints de bookings

Base: `/api/bookings`

| Método | Ruta | Descripción | Éxito | Error |
|--------|------|-------------|-------|-------|
| POST | `/api/bookings` | Crea una reserva | 201 | 400 si faltan campos |
| GET | `/api/bookings/:bid` | Devuelve una reserva por id | 200 | 404 si no existe |
| POST | `/api/bookings/:bid/services/:sid` | Agrega un servicio a la reserva | 200 | 404 si no existe la reserva o el servicio |

Ejemplo de body (crear reserva):

```json
{
  "clientName": "Juan Pérez",
  "clientEmail": "juan@mail.com",
  "date": "2026-10-20",
  "time": "10:00"
}
```

## Formato de respuestas

Todas las respuestas siguen el formato:

```json
{ "status": "success" | "error", "payload": ..., "message": ... }
```

`payload` en las respuestas exitosas, `message` en las de error.

## Estructura del proyecto

```
src/
  app.js                        configura Express y monta los routers
  server.js                     conecta a MongoDB y levanta el servidor
  config/
    env.config.js               carga y valida las variables de entorno (incluye MONGO_URI)
    database.config.js          conexión a MongoDB con Mongoose (connectDB)
    container.js                composition root: instancia DAO -> repo -> service e inyecta dependencias
  controllers/
    services.controller.js      request/response del recurso services
    bookings.controller.js      request/response del recurso bookings
  services/
    service.service.js          reglas de negocio de services
    booking.service.js          reglas de negocio de bookings
  repositories/
    service.repository.js       abstracción sobre el DAO de services
    booking.repository.js       abstracción sobre el DAO de bookings
  dao/
    service.dao.js              acceso a datos de services (Mongoose)
    booking.dao.js              acceso a datos de bookings (Mongoose)
    models/
      service.model.js          schema y model de services
      booking.model.js          schema y model de bookings
      message.model.js          schema y model de messages (preparado para etapas futuras)
  routes/
    services.router.js          endpoints del recurso services
    bookings.router.js          endpoints del recurso bookings
.env.example                    ejemplo de variables de entorno
.gitignore
package.json
README.md
```