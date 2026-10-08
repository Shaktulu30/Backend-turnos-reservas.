# Backend Turnos y Reservas - Pre-entrega 1

Administrador de servicios para un sistema de turnos y reservas, hecho con Node.js y módulos ESM. Gestiona servicios en memoria a través de una clase `ServiceManager` (crear, listar, buscar, actualizar y eliminar).

## Instalación

```bash
git clone <url-del-repo>
cd Backend-turnos-reservas
npm install
```

## Ejecución

```bash
node app.js
```

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

- `id` — identificador único, se genera automáticamente
- `name` — nombre del servicio
- `description` — descripción
- `duration` — duración en minutos
- `price` — precio
- `category` — categoría
- `available` — disponibilidad (true/false)

## Métodos del ServiceManager

- `getServices()` — devuelve todos los servicios
- `getServiceById(id)` — devuelve un servicio por id
- `addService(data)` — crea un servicio (genera el id, valida campos obligatorios)
- `updateService(id, data)` — actualiza un servicio sin permitir cambiar el id
- `deleteService(id)` — elimina un servicio