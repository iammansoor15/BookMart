const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bookSchema = require("../models/bookSchema");
const User = require("../models/userSchema");
const RentalRequest = require("../models/rentalRequestSchema");
const Notification = require("../models/norificationSchema");

router.post("/rent/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await bookSchema.findById(id);
    const requester = await User.findById(req.cookies.userId);

    if (!book) return res.status(404).json({ msg: "Book not found" });
    if (!requester) return res.status(404).json({ msg: "User not found" });
    if (book.status === "rented")
      return res.status(400).json({ msg: "Book already rented" });

    const owner = await User.findOne({ phone: book.phone });
    if (!owner) {
      console.error("No owner found :", book.phone);
      return res
        .status(404)
        .json({ msg: `Book owner not found : ${book.phone}` });
    }
    const request = new RentalRequest({
      bookId: book._id,
      requesterId: requester._id,
      ownerId: owner._id,
    });

    await request.save();

    res.json({ msg: "Rental request sent to owner" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});



router.post("/rental-request/:requestId/accept", async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await RentalRequest.findById(requestId);
    if (!request)
      return res.status(404).json({ msg: "Rental request not found" });

    request.status = "accepted";
    await request.save();

    const updatedBook = await bookSchema.findByIdAndUpdate(
      request.bookId,
      { status: "rented" },
      { new: true }
    );
    if (!updatedBook) {
      return res.status(404).json({ msg: "Book not found" });
    }

    await Notification.create({
      userId: request.requesterId,
      message: `Your rental request for "${updatedBook.title}" has been accepted!`,
    });

    res.json({ msg: "Rental request accepted and notification sent" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});




router.post("/rental-request/:requestId/decline", async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await RentalRequest.findById(requestId);
    if (!request)
      return res.status(404).json({ msg: "Rental request not found" });

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

    res.json({ msg: "Rental request declined and notification sent" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server error" });
  }
});



router.get("/rental-requests/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;
    const requests = await RentalRequest.find({ ownerId, status: "pending" })
      .populate("bookId")
      .populate("requesterId");
    res.json({ rentalRequests: requests });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Error fetching rental requests" });
  }
});




module.exports = router;
