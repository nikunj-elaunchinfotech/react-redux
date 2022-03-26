const mongoose = require("mongoose");

const cities = mongoose.model(
  "cities",
  new mongoose.Schema({
    name: String,
    code: String,
    country_id: String,
    country_code: String,
    state_id: String,
    state_code: String,
  })
);

module.exports = cities;
