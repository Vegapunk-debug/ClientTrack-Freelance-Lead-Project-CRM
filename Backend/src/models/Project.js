const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  contactDetails: {
    type: String,
    required: true
  },
  source: {
    type: String,
    enum: ["LinkedIn", "Instagram", "Unstop", "X"],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["In Progress", "On Hold", "Partially Completed", "Completed"],
    default: "In Progress"
  },
  revenue: {
    type: Number,
    required: true
  },
  expectedTime: {
    type: Date,
    required: true
  },
  followUpNotes: [{
    note: String,
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);

