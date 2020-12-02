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
    likes: Array,
    matches: Array
})

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;

//_id: 'mongoose.Schema.Types.ObjectId',
/*<input type="text" name="name" value='<%=userList.name%>' style="display: none;">
                    <input type="text" name="email" value='<%=userList.email%>' style="display: none;">
                    <input type="text" name="age" value='<%=userList.age%>' style="display: none;">
                    <input type="text" name="interest" value='<%=userList.interest%>' style="display: none;"> */