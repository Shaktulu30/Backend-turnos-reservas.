# Backend Turnos y Reservas - Pre-entrega 2

API REST para un sistema de turnos y reservas, hecha con Node.js, Express y módulos ESM. Expone endpoints para gestionar el recurso `services` (crear, listar, buscar, actualizar y eliminar). La lógica de servicios vive en la clase `ServiceManager` y los datos se manejan en memoria.

## Instalación

```bash
git clone <url-del-repo>
cd Backend-turnos-reservas
npm install
```

## Ejecución

```bash
node src/server.js
```

El servidor queda escuchando en `http://localhost:PORT` (por defecto 8080).

## Variables de entorno

Crear un archivo `.env` en la raíz tomando como base `.env.example`:

- `PORT` — puerto de la aplicación (ej: 8080)
- `NODE_ENV` — entorno de ejecución (ej: development)

La app no arranca si falta alguna de estas variables.

## Recurso: services

Cada servicio tiene esta forma:

```js
{ id, name, description, duration, price, category, available }
```

El `id` se genera automáticamente; no se envía en el body.

## Endpoints

Base: `/api/services`

| Método | Ruta | Descripción | Éxito | Error |
|--------|------|-------------|-------|-------|
| GET | `/api/services` | Lista todos los servicios | 200 | — |
| GET | `/api/services/:sid` | Devuelve un servicio por id | 200 | 404 si no existe |
| POST | `/api/services` | Crea un servicio | 201 | 400 si faltan campos |
| PUT | `/api/services/:sid` | Actualiza un servicio (no cambia el id) | 200 | 404 si no existe |
| DELETE | `/api/services/:sid` | Elimina un servicio | 200 | 404 si no existe |

### Ejemplo de body (POST / PUT)

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

Las respuestas siguen el formato `{ "status": "success" | "error", "payload" | "message": ... }`.

## Estructura del proyecto

```
src/
  app.js                     configura Express y monta el router
  server.js                  levanta el servidor
  config/env.config.js       variables de entorno
  managers/ServiceManager.js lógica de servicios
  routes/services.router.js  endpoints del recurso services
  data/services.json         persistencia (uso futuro)
```