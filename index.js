const express = require('express') // kalder express
const cors = require('cors');
const app = express(); // benytter express
const port = 3000
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./Routes/userRoutes');
const ejs = require('ejs');
const session = require('express-session');
const cookieParser = require('cookie-parser');




mongoose.connect("mongodb+srv://eksamen:eksamen@cluster0.uuj1t.mongodb.net/Cluster0?retryWrites=true&w=majority", { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true });
//connecter til mongoDB cluster

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
console.log("database connected");
});

app.set('view engine', 'ejs');

// skal gå igennem 
app.use('/routes', userRoutes); // henviser til mine userRoutes 
//app.use('/Routes', adminRoutes); 
app.use(cors());
app.use(express.static("./Views/")); // for at hente HTML/CSS til view engine 
 //sætter view engine til ejs
app.use(cookieParser());
app.use(session({
  key: "user",
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie:{ expires:700000 }
}));

//forkert placering af req.session.user 
 app.get('/', (req,res) => {
  res.render("index.ejs");
 });

 app.listen(port, () => {
  console.log(`App kører på http://localhost:${port}`)
})





/*
module.exports.delete = (req,res) => {
  userModel
   .findByIdAndRemove(req.body.id)
   .exec()
   .then(doc => {
   if (!doc) {return res.status(404).end(); }
   return res.status(200).render("index.ejs");
   })   //ellers 204.end()
   .catch(err => next(err));
}
*/
