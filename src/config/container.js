import ServiceDAO from "../dao/service.dao.js";
import ServiceRepository from "../repositories/service.repository.js";
import ServiceService from "../services/service.service.js";
import BookingDAO from "../dao/booking.dao.js";
import BookingRepository from "../repositories/booking.repository.js";
import BookingService from "../services/booking.service.js";

const serviceDAO = new ServiceDAO("./src/data/services.json");
const serviceRepository = new ServiceRepository(serviceDAO);
const serviceService = new ServiceService(serviceRepository);

const bookingDAO = new BookingDAO("./src/data/bookings.json");
const bookingRepository = new BookingRepository(bookingDAO);
const bookingService = new BookingService(bookingRepository, serviceService);

export { serviceService, bookingService };