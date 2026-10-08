export class ServiceManager {
  constructor() {
    this.services = [];
  }

  addService(service) {
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

    let nuevoId;
    if (this.services.length === 0) {
      nuevoId = 1;
    } else {
      const ids = this.services.map((s) => s.id);
      nuevoId = Math.max(...ids) + 1;
    }

    const nuevoService = { id: nuevoId, ...service };

    this.services.push(nuevoService);

    return nuevoService;
  }

  getServiceById(id) {
    const service = this.services.find((s) => s.id === id);

    if (service === undefined) {
      return { error: "Servicio no encontrado" };
    }

    return service;
  }

  updateService(id, data) {
    const index = this.services.findIndex((s) => s.id === id);
    if (index === -1) {
      return { error: "Servicio no encontrado" };
    }

    const actualizadoService = { ...this.services[index], ...data, id: this.services[index].id };
    this.services[index] = actualizadoService;
    return actualizadoService;
  }

  deleteService(id) {
    const index = this.services.findIndex((s) => s.id === id);
    if (index === -1) {
      return { error: "Servicio no encontrado" };
    }

    this.services.splice(index, 1);
    return { message: "Servicio eliminado correctamente" };
  }

  getServices() {
    return this.services;
  }
}
