const express = require('express') // kalder express
const cors = require('cors');
const app = express(); // benytter express
const port = 3000
const mongoose = require('mongoose');
const adminModel = require("./Model/Admin");
const userModel = require("./Model/User");
const bodyParser = require('body-parser');
const { request } = require('express');
const ejs = require('ejs');

mongoose.connect("mongodb+srv://eksamen:eksamen@cluster0.uuj1t.mongodb.net/Cluster0?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
console.log("database connected");
});

// skal gå igennem 
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({urlencoded: true}));
app.use(express.static("./Views/")); // for at hente css til view engine 
app.set("view-engine", "ejs"); //sætter view engine til ejs
//henter html - måske gøre det samme for logget ind!
app.get('/', function(req, res) {
  res.render("index.ejs");
}); //henter min index fil





app.post('/signup', (req, res) => {
  const newUser = new userModel({
    role: "user",
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    age: req.body.age,
    gender: req.body.gender,
    preferredGender: req.body.preferredGender,
    interest: req.body.interest
  });

  newUser.save()
    .then(user =>{

    if(user)
    {res.status(200).render("homepage.ejs"); // redirect til homepage html fil 
  }
  })
    .catch(err =>
    res.status(500).json({error: err}));
});

//tjekke for admin også
app.post('/login', (req,res) => {
  if(req.body!=null){
    userModel.find({email:req.body.email})
    .then(users => {
      if(users.length < 1){
        res.send("No user found");
      }
      if(users[0].role==req.body.role){
        res.status(200).json({message: "succes" + "role:" + users[0].role})
      } else {
        res.status(403).json({message: "unauthorised"})
      }
    })
    .catch(err => {
      if (err){
        res.status(500).json({error: err})
      } else {
        res.status(404).json({error: "error"})
      }
    });

  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})