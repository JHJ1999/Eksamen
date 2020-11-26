const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    role: String,
    name: String,
    email: String,
    password: String,
    age: Number,
    gender: String,
    preferredGender: String,
    interest: String,
    likes: Array
})

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;