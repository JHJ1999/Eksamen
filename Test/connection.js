const mongoose = require('mongoose');


// connect til mongoDB
mongoose.connect("mongodb+srv://eksamen:eksamen@cluster0.uuj1t.mongodb.net/Cluster0?retryWrites=true&w=majority", { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true });


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
console.log("database connected");
});