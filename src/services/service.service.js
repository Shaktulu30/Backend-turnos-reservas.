export default class ServiceService {
  constructor(repository) {
    this.repository = repository;
  }

  getAll() {
    return this.repository.getAll();
  }

  async create(service) {
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
    return await this.repository.create(service);
  }

  async getById(id) {
    const service = await this.repository.getById(id);
    if (service === null) {
      return { error: "Servicio no encontrado" };
    }
    return service;
  }

  async update(id, data) {
    const updated = await this.repository.update(id, data);
    if (updated === null) {
      return { error: "Servicio no encontrado" };
    }
    return updated;
  }

  async delete(id) {
    const deleted = await this.repository.delete(id);
    if (deleted === null) {
      return { error: "Servicio no encontrado" };
    }
    return { message: "Servicio eliminado correctamente" };
  }
}
