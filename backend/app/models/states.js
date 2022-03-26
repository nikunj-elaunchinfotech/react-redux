const mongoose = require("mongoose");

const states = mongoose.model(
  "states",
  new mongoose.Schema({
    name: String,
    code: String,
    country_id: String,
    country_code: String,
  })
);

module.exports = states;
