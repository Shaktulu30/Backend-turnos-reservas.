
export default class ServiceDAO {
  constructor(model) {
    this.model = model;
  }

  async getAll() {
    return await this.model.find();
  }

  async getById(id) {
    return await this.model.findById(id);
  }

  async create(service) {
    return await this.model.create(service);
  }

  async update(id, fields) {
    return await this.model.findByIdAndUpdate(id, fields, { new: true });
  }

  async delete(id) {
    const deleted = await this.model.findByIdAndDelete(id)
    return deleted ? true : null;
  }
}
