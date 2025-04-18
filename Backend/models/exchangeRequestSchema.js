const mongoose = require('mongoose');

const exchangeRequestSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  requestedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ExchangeRequest', exchangeRequestSchema);
