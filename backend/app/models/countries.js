const mongoose = require("mongoose");

const countries = mongoose.model(
  "countries",
  new mongoose.Schema({
    name: String,
    code: String,
  })
);

module.exports = countries;
