const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bookSchema = require("../models/bookSchema");
const User = require("../models/userSchema");
const ExchangeRequest = require("../models/exchangeRequestSchema");
const RentalRequest = require("../models/rentalRequestSchema");
const Notification = require("../models/norificationSchema");





router.post("/exchange/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await bookSchema.findById(id);
    const requester = await User.findById(req.cookies.userId);

    if (!book) return res.status(404).json({ msg: "Book not found" });
    if (!requester) return res.status(404).json({ msg: "User not found" });
    if (book.status === "exchanged")
      return res.status(400).json({ msg: "Book already rented you cannot buy it untill the seeker returns the book to the owner" });

    const owner = await User.findOne({ phone: book.phone });
    if (!owner) {
      console.error("No owner found :", book.phone);
      return res
        .status(404)
        .json({ msg: `Book owner not found : ${book.phone}` });
    }
    const request = new ExchangeRequest({
      bookId: book._id,
      requesterId: requester._id,
      ownerId: owner._id,
    });

    await request.save();

    res.json({ msg: "Exchange request sent to owner" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});



router.post("/exchange-request/:requestId/accept", async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await ExchangeRequest.findById(requestId);
    if (!request)
      return res.status(404).json({ msg: "Buying request not found" });

    request.status = "accepted";
    await request.save();

    const updatedBook = await bookSchema.findByIdAndUpdate(
      request.bookId,
      { status: "exchanged" },
      { new: true }
    );
    if (!updatedBook) {
      return res.status(404).json({ msg: "Book not found" });
    }

    await Notification.create({
      userId: request.requesterId,
      message: `Your Exchange request for "${updatedBook.title}" has been accepted!`,
    });

    res.json({ msg: "Excahnge request accepted and notification sent" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});



router.post("/exchange-request/:requestId/decline", async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await ExchangeRequest.findById(requestId);
    if (!request)
      return res.status(404).json({ msg: "Exchange request not found" });

    request.status = "declined";
    await request.save();

    const updatedBook = await bookSchema.findByIdAndUpdate(
      request.bookId,
      { status: "active" }, 
      { new: true }
    );
    if (!updatedBook) {
      return res.status(404).json({ msg: "Book not found" });
    }

    await Notification.create({
      userId: request.requesterId,
      message: `Your rental request for "${updatedBook.title}" has been Declined!`,
    });

    res.json({ msg: "Exchange request declined and notification sent" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});




router.get("/exchange-requests/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;
    const requests = await ExchangeRequest.find({ ownerId, status: "pending" })
      .populate("bookId")
      .populate("requesterId");
    res.json({ exchangeRequests: requests }); // <<<--- Change key name here
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Error fetching exchange requests" });
  }
});



module.exports = router;
