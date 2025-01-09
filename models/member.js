const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    mobile: Number,
    email: String,
    occupation: String,
    createpassword: String
});

module.exports = mongoose.model('Member', memberSchema);