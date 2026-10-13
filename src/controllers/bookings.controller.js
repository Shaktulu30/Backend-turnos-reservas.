import { BookingManager } from "../managers/BookingManager.js";

const bookingManager = new BookingManager();

export const createBooking = async (req, res) => {
    const booking = req.body;
    const resultado = await bookingManager.createBooking(booking);
    if (resultado.error) {
        res.status(400).json({ status: "error", message: resultado.error});
    } else {
        res.status(201).json({ status: "success", payload: resultado });
    }
}

export const getBookingById = async (req, res) => {
    const bookingId = Number(req.params.bid);
    const booking = await bookingManager.getBookingById(bookingId);
    if (booking.error) {
        res.status(404).json({ status: "error", message: booking.error });
    } else {
        res.status(200).json({ status: "success", payload: booking})
    }
}

export const addServiceToBooking = async (req, res) => {
    const bid = Number(req.params.bid);
    const sid = Number(req.params.sid);

    const resultado = await bookingManager.addServiceToBooking(bid, sid);
    if (resultado.error) {
        res.status(404).json({ status: "error", message: resultado.error})
    } else {
        res.status(200).json ({ status: "success", payload: resultado})
    }
}

