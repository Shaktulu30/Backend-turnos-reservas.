import ServiceDAO from "../dao/service.dao.js";
import ServiceRepository from "../repositories/service.repository.js";
import ServiceService from "../services/service.service.js";
import BookingDAO from "../dao/booking.dao.js";
import BookingRepository from "../repositories/booking.repository.js";
import BookingService from "../services/booking.service.js";
import { ServiceModel }from "../dao/models/service.model.js"
import { BookingModel } from "../dao/models/booking.model.js"

const serviceDAO = new ServiceDAO(ServiceModel);
const serviceRepository = new ServiceRepository(serviceDAO);
const serviceService = new ServiceService(serviceRepository);

const bookingDAO = new BookingDAO(BookingModel);
const bookingRepository = new BookingRepository(bookingDAO);
const bookingService = new BookingService(bookingRepository, serviceService);

export { serviceService, bookingService };