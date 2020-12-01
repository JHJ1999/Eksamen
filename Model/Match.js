const mongoose = require('mongoose');


const matchSchema = mongoose.Schema({
    name: String,
    email: String,
    age: String,
    interest: String
});

const adminModel = mongoose.model('match', matchSchema)

module.exports = matchModel;