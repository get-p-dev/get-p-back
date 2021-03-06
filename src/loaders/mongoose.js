const mongoose = require('mongoose');
const config = require("../config");

module.exports = function (callback) {
    mongoose
    .connect(config.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Successfully connected to mongodb'))
    .catch(e => console.error(e))
    .finally(() => callback());
};