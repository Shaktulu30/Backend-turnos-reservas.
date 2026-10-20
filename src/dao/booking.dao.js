export default class BookingDAO {
  constructor(model) {
    this.model = model;
  }

  async getById(id) {
    return await this.model.findById(id).populate("services.service");
  }

  async create(booking) {
    return await this.model.create(booking);
  }

  async update(id, fields) {
    return await this.model.findByIdAndUpdate(id, fields, { new: true });
  }

  async delete(id) {
    const deleted = await this.model.findByIdAndDelete(id);
    return deleted ? true : null;
  }
}
