import { ServiceManager } from './src/managers/ServiceManager.js';
import { envConfig } from './src/config/env.config.js';

const manager = new ServiceManager();

const s1 = manager.addService({
  name: "Consulta", description: "General", duration: 30,
  price: 12000, category: "salud", available: true,
});

console.log("Servicio creado:", s1);
console.log("Todos los servicios:", manager.getServices());

console.log(`App corriendo en entorno: ${envConfig.nodeEnv}, puerto configurado: ${envConfig.port}`);