const express = require('express') // kalder express
const cors = require('cors');
const app = express(); // benytter express
const port = 3000
const mongoose = require('mongoose');
const userModel = require("./Model/User");
const bodyParser = require('body-parser');
const ejs = require('ejs');
const session = require('express-session');
const { findOneAndUpdate, update } = require('./Model/User');


mongoose.connect("mongodb+srv://eksamen:eksamen@cluster0.uuj1t.mongodb.net/Cluster0?retryWrites=true&w=majority", { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true });
//connecter til mongoDB cluster

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
console.log("database connected");
});

// skal gå igennem 
app.use(cors());
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({urlencoded: true}));
app.use(express.static("./Views/")); // for at hente HTML/CSS til view engine 
 //sætter view engine til ejs
//henter html - måske gøre det samme for logget ind!

app.use(session({
  secret: 'secret',
  resave: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 365 * 1000
  }
})) //forblive logget ind 

app.get('/', function(req, res) {
  res.render("index.ejs");
}); //henter min index fil


//finder alle users - test for admin
app.get("/admin", function(req,res){
  userModel.find({role: "user"})
      .then(user => {
          res.status(200).json(user);
      })
      .catch( err => {
          res.status(500).json({
              error: err
          });
      });
});

app.post('/signup', (req, res) => { //fejl i denne
  const newUser = new userModel({
    _id: mongoose.Types.ObjectId(),
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

    if(user) //lige nu ikke oprette ny user pga den ikke render de nye ændringer i homepage.html
    {res.status(200).render("homepage.ejs", {user: user}); // redirect til homepage html fil 
  }
  })
    .catch(err =>
    res.status(500).json({error: err}));
});

app.post('/delete', (req,res) => {
   userModel
    .findByIdAndRemove(req.body.id)
    .exec()
    .then(doc => {
    if (!doc) {return res.status(404).end(); }
    return res.status(200).render("index.ejs");
    })   //ellers 204.end()
    .catch(err => next(err));
})


app.post('/update', (req,res) => {
 var id= req.params._id; 
  userModel
  .find({_id: id})
  .then(doc => {
  if (!doc) {return res.status(404).end(); }
  return res.status(200);
  })   //ellers 204.end()
  .catch(err => next(err));
})

app.post('/login', (req,res) => {
  if(req.body!=null){
    userModel.find({email:req.body.email})
    .then(users => {
      if(users.length < 1){
        res.send("No user found");
      } // tjekker om det er admin- eller user login 
      if(users[0].role==req.body.role && users[0].password==req.body.password){
        if(users[0].role == "admin") {
          userModel.find({role: "user"}) //henter liste af users til admin side
          .then(allUsers => {
            res.status(200).render("homepage.ejs", {admin: users[0], allUsers: allUsers});
          })
          .catch( err => {
            res.status(500).json({
                error: err
          })
      });
      }

      else if (users[0].role == "user") {
          userModel.find({role: "user"})
          .then (userList => {
            res.status(200).render("homepage.ejs", {user: users[0], userList});
          })
          
      } 
        else {
          res.status(200).json(users[0]);
        }
       
      } 
        else {
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