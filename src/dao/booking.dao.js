
export default class BookingDAO {
  constructor(model) {
    this.model = model;
  }

  async getById(id) {
    return await this.model.findById(id);
  }

  async create(booking) {
    return await this.model.create(booking);
  }

  async update(id, fields) {
    return await this.model.findByIdAndUpdate(id, fields, { new: true });
  }
}
