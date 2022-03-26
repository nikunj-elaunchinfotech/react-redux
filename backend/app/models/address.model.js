const mongoose = require("mongoose");

const Address = mongoose.model(
  "Address",
  new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    temporary: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cities",
      },
      state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "states",
      },
      country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "countries",
      },
    },
    permanent: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cities",
      },
      state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "states",
      },
      country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Country",
      },
    },
  })
);

module.exports = Address;
