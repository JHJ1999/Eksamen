const express = require('express')
const cors = require('cors');
const app = express();
const port = 3000
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://eksamen:eksamen@cluster0.uuj1t.mongodb.net/eksamen?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
console.log("database connected");
});


app.use(cors());

app.get('/', (req, res) => {
  res.send('')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})