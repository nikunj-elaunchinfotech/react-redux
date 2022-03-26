const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;


db.user = require("./user.model");
db.role = require("./role.model");
db.employe = require("./employe.model")(mongoose, mongoosePaginate);
db.address = require("./address.model");
db.countries = require("./countries");
db.states = require("./states");
db.cities = require("./cities");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;