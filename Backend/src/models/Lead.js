const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
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
  estimatedRevenue: {
    type: Number,
    required: true
  },
  expectedTime: {
    type: Date,
    required: true
  },
  followUpDate: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model("Lead", leadSchema);

