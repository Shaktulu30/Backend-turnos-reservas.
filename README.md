# Backend - Sistema de Turnos y Reservas

API REST para un sistema de turnos y reservas, hecha con Node.js, Express y módulos ESM. Gestiona dos recursos, `services` (servicios disponibles) y `bookings` (reservas), con persistencia en **MongoDB Atlas** mediante **Mongoose**. Incluye vistas del lado del servidor con **Handlebars**, comunicación en tiempo real con **Socket.io** y validación de datos con **Zod**.

El proyecto está organizado en una arquitectura en capas, separando responsabilidades de forma que la persistencia quede aislada en la capa más baja:

```
Cliente  ->  Ruta  ->  Controller  ->  Service  ->  Repository  ->  DAO  ->  MongoDB (Mongoose)
```

- **routes/**: definen los endpoints y los conectan con su controller (no tienen lógica).
- **controllers/**: leen `req.params` / `req.body`, llaman al service y arman la response (no tocan la base).
- **services/**: reglas de negocio (defaults, coordinación entre recursos). No conocen `req`/`res` ni Mongoose.
- **repositories/**: envuelven al DAO (inyectado por constructor) y reenvían. Capa de abstracción sobre la persistencia.
- **dao/**: acceso a datos con Mongoose. Es la única capa que conoce la base de datos.
- **dao/models/**: schemas y models de Mongoose.

La conexión a MongoDB está centralizada y la instanciación de las capas se hace una sola vez en un _composition root_ (`config/container.js`), que inyecta las dependencias (DAO → Repository → Service).

## Instalación

```bash
git clone <url-del-repo>
cd Backend-turnos-reservas
npm install
```

Dependencias principales: `express`, `mongoose`, `express-handlebars`, `socket.io` y `zod`.

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

| Método | Ruta                 | Descripción                 | Éxito | Error                  |
| ------ | -------------------- | --------------------------- | ----- | ---------------------- |
| GET    | `/api/services`      | Lista los servicios         | 200   | —                      |
| GET    | `/api/services/:sid` | Devuelve un servicio por id | 200   | 404 si no existe       |
| POST   | `/api/services`      | Crea un servicio            | 201   | 400 si datos inválidos |
| PUT    | `/api/services/:sid` | Actualiza un servicio       | 200   | 400 / 404              |
| DELETE | `/api/services/:sid` | Elimina un servicio         | 200   | 404 si no existe       |

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

### Consultas avanzadas en `GET /api/services`

El listado acepta query params opcionales para filtrar, paginar y ordenar. Se pueden combinar.

| Param       | Valores             | Descripción               |
| ----------- | ------------------- | ------------------------- |
| `category`  | texto               | Filtra por categoría      |
| `available` | `true` / `false`    | Filtra por disponibilidad |
| `page`      | número (default 1)  | Página solicitada         |
| `limit`     | número (default 10) | Resultados por página     |
| `sortBy`    | campo (ej: `price`) | Campo por el que ordenar  |
| `order`     | `asc` / `desc`      | Dirección del orden       |

Ejemplos:

```
GET /api/services?category=grupal
GET /api/services?available=true
GET /api/services?page=2&limit=5
GET /api/services?sortBy=price&order=desc
GET /api/services?category=grupal&available=true&page=1&limit=5&sortBy=price&order=asc
```

La respuesta incluye el listado y metadata de paginación:

```json
{
  "status": "success",
  "payload": [
    /* servicios */
  ],
  "total": 12,
  "page": 1,
  "limit": 5,
  "totalPages": 3,
  "hasPrevPage": false,
  "hasNextPage": true
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

| Método | Ruta                               | Descripción                                        | Éxito | Error                                     |
| ------ | ---------------------------------- | -------------------------------------------------- | ----- | ----------------------------------------- |
| POST   | `/api/bookings`                    | Crea una reserva                                   | 201   | 400 si datos inválidos                    |
| GET    | `/api/bookings/:bid`               | Devuelve una reserva por id                        | 200   | 404 si no existe                          |
| POST   | `/api/bookings/:bid/services/:sid` | Agrega un servicio a la reserva                    | 200   | 404 si no existe la reserva o el servicio |
| PUT    | `/api/bookings/:bid/services/:sid` | Actualiza la cantidad de un servicio en la reserva | 200   | 400 / 404                                 |
| DELETE | `/api/bookings/:bid/services/:sid` | Elimina un servicio de la reserva                  | 200   | 404                                       |
| DELETE | `/api/bookings/:bid`               | Elimina una reserva                                | 200   | 404 si no existe                          |

Ejemplo de body (crear reserva):

```json
{
  "clientName": "Juan Pérez",
  "clientEmail": "juan@mail.com",
  "date": "2026-10-25",
  "time": "10:00"
}
```

Ejemplo de body (actualizar cantidad):

```json
{
  "quantity": 3
}
```

> `GET /api/bookings/:bid` usa **populate**: cada servicio asociado se devuelve con sus datos completos (nombre, duración, precio, categoría), no solo con el `ObjectId`.

## Validación de datos

Los bodies de entrada se validan con **Zod** mediante un middleware (`validateBody`) que corre antes de los controllers. Si los datos son inválidos, la API responde `400` con el detalle de los campos que fallaron, sin tocar la base de datos.

Esquemas aplicados en:

- `POST /api/services` — crear servicio
- `PUT /api/services/:sid` — actualizar servicio (campos opcionales)
- `POST /api/bookings` — crear reserva
- `POST /api/bookings/:bid/services/:sid` — agregar servicio a reserva
- `PUT /api/bookings/:bid/services/:sid` — actualizar la cantidad de un servicio en la reserva

## Formato de respuestas

Todas las respuestas siguen el formato:

```json
{ "status": "success" | "error", "payload": ..., "message": ... }
```

`payload` en las respuestas exitosas, `message` en las de error.

## Vistas (Handlebars)

Además de la API REST, el proyecto renderiza vistas del lado del servidor con **Handlebars** (`express-handlebars`). Las vistas consumen datos **reales de MongoDB** a través de las mismas capas que la API (controller → service → repository → DAO); no tienen datos hardcodeados.

Base: `/views`

| Ruta                      | Descripción                                              |
| ------------------------- | -------------------------------------------------------- |
| GET `/views/services`     | Lista todos los servicios                                |
| GET `/views/availability` | Lista solo los servicios disponibles (`available: true`) |

El layout general está en `views/layouts/main.handlebars` y los estilos en `public/css/styles.css`.

## Tiempo real (Socket.io)

El proyecto incorpora **Socket.io** (server + cliente) para reflejar cambios en vivo sin recargar la página.

Evento implementado: al **crear un servicio** (`POST /api/services`), el servidor emite el evento `nuevoServicio` y la vista `/views/services` agrega la tarjeta nueva automáticamente.

### Cómo verificar el tiempo real

1. Levantar el servidor (`node src/server.js`).
2. Abrir `http://localhost:PORT/views/services` en el navegador y dejarlo abierto.
3. Desde un cliente HTTP (Thunder Client, Postman, etc.), hacer un `POST` a `/api/services` con un body válido:

```json
{
  "name": "Clase de spinning",
  "description": "Clase grupal de ciclismo indoor",
  "duration": 45,
  "price": 9000,
  "category": "grupal"
}
```

4. Sin tocar el navegador, la tarjeta del nuevo servicio aparece sola en la lista.

## Estructura del proyecto

```
src/
  app.js                        configura Express, Handlebars, estáticos y monta los routers
  server.js                     conecta a MongoDB, levanta el servidor HTTP y Socket.io
  config/
    env.config.js               carga y valida las variables de entorno (incluye MONGO_URI)
    database.config.js          conexión a MongoDB con Mongoose (connectDB)
    container.js                composition root: instancia DAO -> repo -> service e inyecta dependencias
  controllers/
    services.controller.js      request/response del recurso services
    bookings.controller.js      request/response del recurso bookings
    views.controller.js         renderiza las vistas de Handlebars con datos reales
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
    views.router.js             endpoints de las vistas (/views)
  middlewares/
    validate.middleware.js      valida el body con Zod (400 si falla)
  validations/
    service.validation.js       esquemas Zod de services (crear / actualizar)
    booking.validation.js       esquemas Zod de bookings (crear / agregar servicio / cantidad)
  views/
    layouts/
      main.handlebars           layout general
    services.handlebars         vista de servicios
    availability.handlebars     vista de servicios disponibles
public/
  css/
    styles.css                  estilos de las vistas
  js/
    socket.js                   cliente de Socket.io (escucha el evento nuevoServicio)
.env.example                    ejemplo de variables de entorno
.gitignore
package.json
README.md