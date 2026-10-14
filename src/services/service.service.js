export default class ServiceService {
  constructor(repository) {
    this.repository = repository;
  }

  getAll() {
    return this.repository.getAll();
  }

  async create(service) {
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

  async getPaginated(query = {}) {
    const { category, available, page = 1, limit = 10, sortBy, order } = query;

    // filtro
    const filter = {};
    if (category) filter.category = category;
    if (available !== undefined) filter.available = available === "true";

    // paginación
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // ordenamiento
    const sort = {};
    if (sortBy) sort[sortBy] = order === "desc" ? -1 : 1;

    const { docs, total } = await this.repository.getPaginated(filter, {
      skip,
      limit: limitNum,
      sort,
    });

    const totalPages = Math.ceil(total / limitNum);

    return {
      payload: docs,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasPrevPage: pageNum > 1,
      hasNextPage: pageNum < totalPages,
    };
  }
}
