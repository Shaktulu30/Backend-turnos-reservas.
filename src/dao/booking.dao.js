import fs from "fs/promises";

export default class BookingDAO {
  constructor(path) {
    this.path = path;
  }

  async #read() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.log("Error al leer el archivo", error.message);
      return [];
    }
  }

  async #write(bookings) {
    try {
      const jsonData = JSON.stringify(bookings, null, 2);
      await fs.writeFile(this.path, jsonData, "utf-8");
    } catch (error) {
      console.log("Error al escribir el archivo", error.message);
    }
  }

  async getById(id) {
    const bookings = await this.#read();
    return bookings.find((s) => s.id === id) ?? null;
  }

  async create(booking) {
    const bookings = await this.#read();
    const id =
      bookings.length > 0 ? Math.max(...bookings.map((s) => s.id)) + 1 : 1;
    const newBooking = { ...booking, id };
    bookings.push(newBooking);
    await this.#write(bookings);
    return newBooking;
  }

    async update(id, fields) {
    const bookings = await this.#read();
    const index = bookings.findIndex((s) => s.id === id);
    if (index === -1) return null;
    bookings[index] = { ...bookings[index], ...fields, id }; // id blindado
    await this.#write(bookings);
    return bookings[index];
  }
}
