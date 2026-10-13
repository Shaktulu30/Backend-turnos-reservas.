import fs from "fs/promises";

export default class ServiceDAO {
  constructor(path) {
    this.path = path; // la fuente de la verdad
  }

  // --- helpers de persistencia (privados) ---
  async #read() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.log("Error al leer el archivo", error.message);
      return [];
    }
  }

  async #write(services) {
    try {
      const jsonData = JSON.stringify(services, null, 2);
      await fs.writeFile(this.path, jsonData, "utf-8");
    } catch (error) {
      console.log("Error al escribir el archivo", error.message);
    }
  }

  async getAll() {
    return await this.#read();
  }

  async getById(id) {
    const services = await this.#read();
    return services.find((s) => s.id === id) ?? null;
  }

  async create(service) {
    const services = await this.#read();
    const id =
      services.length > 0 ? Math.max(...services.map((s) => s.id)) + 1 : 1;
    const newService = { ...service, id };
    services.push(newService);
    await this.#write(services);
    return newService;
  }

  async update(id, fields) {
    const services = await this.#read();
    const index = services.findIndex((s) => s.id === id);
    if (index === -1) return null;
    services[index] = { ...services[index], ...fields, id }; // id blindado
    await this.#write(services);
    return services[index];
  }

  async delete(id) {
    const services = await this.#read();
    const index = services.findIndex((s) => s.id === id);
    if (index === -1) return null;
    services.splice(index, 1);
    await this.#write(services);
    return true;
  }
}
