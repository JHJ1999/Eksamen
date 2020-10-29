const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    role: String,
    name: String,
    email: String,
    password: String,
    age: Number,
    gender: String,
    preferredGender: String,
    interest: [String],
})

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;