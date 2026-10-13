# Backend Turnos y Reservas - Pre-entrega 4

API REST para un sistema de turnos y reservas, hecha con Node.js, Express y módulos ESM. Gestiona dos recursos, `services` (servicios disponibles) y `bookings` (reservas), con persistencia en archivos JSON mediante FileSystem.

En esta etapa la API está organizada en capas, separando responsabilidades entre rutas, controllers y managers:

```
Cliente  ->  Ruta  ->  Controller  ->  Manager  ->  Archivo JSON
```

- **routes/**: definen los endpoints y los conectan con su controller (no tienen lógica).
- **controllers/**: leen `req.params` / `req.body`, llaman al manager y arman la response.
- **managers/**: manejan la lógica de acceso a datos con FileSystem (no usan `req` ni `res`).

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

La app **no arranca** si falta alguna de estas variables (validación fail-fast).

## Ejecución

```bash
node src/server.js
```

El servidor queda escuchando en `http://localhost:PORT`, usando el puerto definido en `.env`.

## Recurso: services

Cada servicio tiene esta forma:

```js
{ id, name, description, duration, price, category, available }
```

El `id` se genera automáticamente; no se envía en el body.

### Endpoints de services

Base: `/api/services`

| Método | Ruta | Descripción | Éxito | Error |
|--------|------|-------------|-------|-------|
| GET | `/api/services` | Lista todos los servicios | 200 | — |
| GET | `/api/services/:sid` | Devuelve un servicio por id | 200 | 404 si no existe |
| POST | `/api/services` | Crea un servicio | 201 | 400 si faltan campos |
| PUT | `/api/services/:sid` | Actualiza un servicio (no cambia el id) | 200 | 404 si no existe |
| DELETE | `/api/services/:sid` | Elimina un servicio | 200 | 404 si no existe |

Ejemplo de body (POST / PUT):

```json
{
  "name": "Consulta general",
  "description": "Consulta inicial",
  "duration": 30,
  "price": 12000,
  "category": "salud",
  "available": true
}
```

## Recurso: bookings

Una reserva guarda los datos de la reserva y la lista de servicios asociados. Los servicios no se guardan completos: se referencian por su `id`, con la cantidad:

```js
{ service: 2, quantity: 1 }
```

Si se agrega un servicio que ya estaba en la reserva, no se duplica: se incrementa la `quantity`. Antes de agregarlo, se valida que el servicio exista en `services`.

### Endpoints de bookings

Base: `/api/bookings`

| Método | Ruta | Descripción | Éxito | Error |
|--------|------|-------------|-------|-------|
| POST | `/api/bookings` | Crea una reserva | 201 | 400 si faltan campos |
| GET | `/api/bookings/:bid` | Devuelve una reserva por id | 200 | 404 si no existe |
| POST | `/api/bookings/:bid/services/:sid` | Agrega un servicio a la reserva | 200 | 404 si no existe la reserva o el servicio |

Ejemplo de body (crear reserva) — *ajustar a los campos de tu modelo*:

```json
{
  "client": "Juan Pérez",
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
  server.js                     levanta el servidor
  config/
    env.config.js               carga y valida las variables de entorno
  controllers/
    services.controller.js      request/response del recurso services
    bookings.controller.js      request/response del recurso bookings
  managers/
    ServiceManager.js           acceso a datos de services (FileSystem)
    BookingManager.js           acceso a datos de bookings (FileSystem)
  routes/
    services.router.js          endpoints del recurso services
    bookings.router.js          endpoints del recurso bookings
  data/
    services.json               persistencia de services
    bookings.json               persistencia de bookings
.env.example                    ejemplo de variables de entorno
.gitignore
package.json
README.md
```