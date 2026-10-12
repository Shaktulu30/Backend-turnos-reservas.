import fs from "fs/promises";
import { ServiceManager } from "./ServiceManager.js";

const serviceManager = new ServiceManager();

export class BookingManager {
  constructor() {
    this.path = "./src/data/bookings.json";
  }

  async readBookings() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.log("Error al leer el archivo", error.message);
      return [];
    }
  }

  async writeBookings(bookings) {
    const jsonData = JSON.stringify(bookings, null, 2);
    await fs.writeFile(this.path, jsonData, "utf-8");
  }

  async getBookingById(id) {
    const bookings = await this.readBookings();
    const booking = bookings.find((b) => b.id === id);
    if (booking === undefined) {
      return { error: "Reserva no encontrada" };
    }
    return booking;
  }

    async createBooking(booking) {
    if (
      !booking.clientName ||
      !booking.clientEmail ||
      !booking.date ||
      !booking.time 
    ) {
      return { error: "Todos los campos son obligatorios" };
    }

    const bookings = await this.readBookings();

    let nuevoId;
    if (bookings.length === 0) {
      nuevoId = 1;
    } else {
      const ids = bookings.map((s) => s.id);
      nuevoId = Math.max(...ids) + 1;
    }

    const nuevoBooking = { ...booking, id: nuevoId, status: "pending", services: [] };

    bookings.push(nuevoBooking);

    await this.writeBookings(bookings);

    return nuevoBooking;
  }

  async addServiceToBooking(bid, sid) {
  
  const bookings = await this.readBookings();
  const booking = bookings.find((b) => b.id === bid);
  if (booking === undefined) {
    return { error: "Reserva no encontrada" };
  }

  
  const service = await serviceManager.getServiceById(sid);
  if (service.error) {
    return { error: "Servicio no encontrado" };
  }

  
  const existente = booking.services.find((item) => item.service === sid);

  
  if (existente) {
    existente.quantity++;
  } else {
    booking.services.push({ service: sid, quantity: 1})
  }

  await this.writeBookings(bookings);
  return booking;
}

}