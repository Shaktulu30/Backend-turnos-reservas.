import fs from "fs/promises";
export class ServiceManager {
  constructor() {
    this.path = "./src/data/services.json";
  }

  async readServices() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.log("Error al leer el archivo", error.message);
      return [];
    }
  }

  async writeServices(services) {
    try {
      const jsonData = JSON.stringify(services, null, 2);
      await fs.writeFile(this.path, jsonData, "utf-8");
    } catch (error) {
      console.log("Error al escribir el archivo", error.message);
    }
  }

  async addService(service) {
    if (
      !service.name ||
      !service.description ||
      !service.duration ||
      !service.price ||
      !service.category ||
      service.available === undefined
    ) {
      return { error: "Todos los campos son obligatorios" };
    }

    const services = await this.readServices();

    let nuevoId;
    if (services.length === 0) {
      nuevoId = 1;
    } else {
      const ids = services.map((s) => s.id);
      nuevoId = Math.max(...ids) + 1;
    }

    const nuevoService = { ...service, id: nuevoId };

    services.push(nuevoService);

    await this.writeServices(services);

    return nuevoService;
  }

  async getServiceById(id) {

    const services = await this.readServices();

    const service = services.find((s) => s.id === id);

    if (service === undefined) {
      return { error: "Servicio no encontrado" };
    }

    return service;
  }

  async updateService(id, data) {

    const services = await this.readServices();
    
    const index = services.findIndex((s) => s.id === id);
    if (index === -1) {
      return { error: "Servicio no encontrado" };
    }

    const actualizadoService = {
      ...services[index],
      ...data,
      id: services[index].id,
    };
    services[index] = actualizadoService;

    await this.writeServices(services);

    return actualizadoService;
  }

  async deleteService(id) {

    const services = await this.readServices();

    const index = services.findIndex((s) => s.id === id);
    if (index === -1) {
      return { error: "Servicio no encontrado" };
    }

    services.splice(index, 1);

    await this.writeServices(services);

    return { message: "Servicio eliminado correctamente" };
  }

  async getServices() {
    return await this.readServices();
  }
}
