const mongoose = require('mongoose');


const adminSchema = mongoose.Schema({
    role: String,
    email: String,
    password: String,
});

const adminModel = mongoose.model('Admin', adminSchema)

module.exports = adminModel;
