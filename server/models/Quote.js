const mongoose = require("mongoose");

var Quote = mongoose.model("Quote", {
  title: {
    type: String,
    required: true,
    minlength: 2,
    trim: true
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    trim: true
  },
  type: {
    type: String,
    required: true,
    minlength: 2,
    trim: true
  },
  read: {
    type: Boolean,
    required: false,
    default: false,
    trim: true
  },
  readAt: {
    type: Number,
    required: false,
    default: null,
    trim: true
  }
});

module.exports = {Quote};
