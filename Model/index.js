const express = require('express')
const cors = require('cors');
const app = express();
const port = 3000
const mongoose = require('mongoose');
const adminModel = require("../Model/Admin");
const bodyParser = require('body-parser');
const { request } = require('express');

mongoose.connect("mongodb+srv://eksamen:eksamen@cluster0.uuj1t.mongodb.net/Cluster0?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
console.log("database connected");
});


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({urlencoded: true}));

app.get('/', (req, res) => {
  res.send('')
})

app.post('/signup',(req,res) => {
const newUser = new adminModel({
      role: "user",
      email: req.body.email,
      password: req.body.password
});
newUser.save()
  .then(user =>{

  if(user)
  {res.status(200).json(user);
  }
  })
  .catch(err =>
    res.status(500).json({error: err}));

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})