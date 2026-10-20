export default class BookingService {
  constructor(repository, serviceService) {
    this.repository = repository;
    this.serviceService = serviceService;
  }

  getAll() {
    return this.repository.getAll();
  }

  async create(booking) {
    const newBooking = { ...booking, status: "pending", services: [] };
    return await this.repository.create(newBooking);
  }

  async getById(id) {
    const booking = await this.repository.getById(id);
    if (booking === null) {
      return { error: "Reserva no encontrada" };
    }
    return booking;
  }

  async addServiceToBooking(bid, sid) {
    const booking = await this.repository.getById(bid);
    if (booking === null) {
      return { error: "Reserva no encontrada" };
    }

    const service = await this.serviceService.getById(sid);
    if (service.error) {
      return { error: "Servicio no encontrado" };
    }

    const existente = booking.services.find((item) => item.service.equals(sid));
    if (existente) {
      existente.quantity++;
    } else {
      booking.services.push({ service: sid, quantity: 1 });
    }

    return await this.repository.update(bid, { services: booking.services });
  }

  async updateServiceQuantity(bid, sid, quantity) {
    const booking = await this.repository.getById(bid);
    if (booking === null) {
      return { error: "Reserva no encontrada" };
    }
    const item = booking.services.find((item) => item.service.equals(sid));
    if (!item) {
      return { error: "El servicio no está en la reserva" };
    }
    item.quantity = quantity;
    return await this.repository.update(bid, { services: booking.services });
  }

  async removeServiceFromBooking(bid, sid) {
    const booking = await this.repository.getById(bid);
    if (booking === null) {
      return { error: "Reserva no encontrada" };
    }
    const existe = booking.services.some((item) => item.service.equals(sid));
    if (!existe) {
      return { error: "El servicio no está en la reserva" };
    }
    const nuevosServicios = booking.services.filter(
      (item) => !item.service.equals(sid),
    );
    return await this.repository.update(bid, { services: nuevosServicios });
  }

  async delete(id) {
    const deleted = await this.repository.delete(id);
    if (deleted === null) {
      return { error: "Reserva no encontrada" };
    }
    return { message: "Reserva eliminada correctamente" };
  }
}
