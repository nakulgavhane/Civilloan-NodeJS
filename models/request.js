const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    mobile: Number,
    email: String,
    amt: Number,
    type: String,
    msg: String,
    code: String
});

module.exports = mongoose.model('Request', requestSchema);