import { bookingService } from "../config/container.js";

export const createBooking = async (req, res) => {
  const booking = req.body;
  const resultado = await bookingService.create(booking);
  if (resultado.error) {
    res.status(400).json({ status: "error", message: resultado.error });
  } else {
    res.status(201).json({ status: "success", payload: resultado });
  }
};

export const getBookingById = async (req, res) => {
  const bookingId = req.params.bid;
  const booking = await bookingService.getById(bookingId);
  if (booking.error) {
    res.status(404).json({ status: "error", message: booking.error });
  } else {
    res.status(200).json({ status: "success", payload: booking });
  }
};

export const addServiceToBooking = async (req, res) => {
  const bid = req.params.bid;
  const sid = req.params.sid;
  const resultado = await bookingService.addServiceToBooking(bid, sid);
  if (resultado.error) {
    res.status(404).json({ status: "error", message: resultado.error });
  } else {
    res.status(200).json({ status: "success", payload: resultado });
  }
};

export const updateServiceQuantity = async (req, res) => {
  const { bid, sid } = req.params;
  const { quantity } = req.body;
  const resultado = await bookingService.updateServiceQuantity(
    bid,
    sid,
    quantity,
  );
  if (resultado.error) {
    res.status(404).json({ status: "error", message: resultado.error });
  } else {
    res.status(200).json({ status: "success", payload: resultado });
  }
};

export const removeServiceFromBooking = async (req, res) => {
  const { bid, sid } = req.params;
  const resultado = await bookingService.removeServiceFromBooking(bid, sid);
  if (resultado.error) {
    res.status(404).json({ status: "error", message: resultado.error });
  } else {
    res.status(200).json({ status: "success", payload: resultado });
  }
};

export const deleteBooking = async (req, res) => {
  const { bid } = req.params;
  const resultado = await bookingService.delete(bid);
  if (resultado.error) {
    res.status(404).json({ status: "error", message: resultado.error });
  } else {
    res.status(200).json({ status: "success", message: resultado.message });
  }
};
