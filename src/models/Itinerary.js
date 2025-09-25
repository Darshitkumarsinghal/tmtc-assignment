const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  time: String,
  description: String,
  location: String,
}, { _id: false });

const itinerarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  destination: { type: String, required: true, index: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  activities: [activitySchema],
}, { timestamps: true });

module.exports = mongoose.model('Itinerary', itinerarySchema);
