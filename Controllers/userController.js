const userModel = require("../Model/User");
const mongoose = require('mongoose');

exports.login = (req,res) => {
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
            userModel.find({email : {$ne: req.body.email}}) //ne (not equal) til brugerens email, så man ikke viser sin egen bruger som et muligt match 
            .then (userList => {
              var randomUser = Math.floor(Math.random() * (userList.length));
              res.status(200).render("homepage.ejs", {user: users[0], userList: userList[randomUser]}); //for at vise tilfældige users 
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
}

exports.signup = (req, res) => { 
    console.log(req.body.name);
      const newUser = new userModel({
        
        _id: mongoose.Types.ObjectId(),
        role: "user",
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age,
        gender: req.body.gender,
        preferredGender: req.body.preferredGender,
        interest: req.body.interest,
        likes: []
      });
    
         newUser.save()
        .then(user =>{
          
        userModel.find({email : {$ne: req.body.email}}) //ne (not equal) til brugerens email, så man ikke får vist sin egen bruger som et muligt match 
        .then (userList => {
            res.status(200).render("../Views/homepage.ejs", {user: user, userList: userList});
          })
          .catch(err =>{
            res.status(404).json({error: err})
          })
      })
        .catch(err =>
        res.status(500).json({error: err}));
}


exports.delete = (req,res) => {
    userModel
     .findByIdAndRemove(req.body.id)
     .exec()
     .then(doc => {
     if (!doc) {return res.status(404).end(); }
     return res.status(200).render("index.ejs");
     })   //ellers 204.end()
     .catch(err => next(err));
}

exports.update = (req,res) => {
    var updateUser = {
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
      gender: req.body.gender,
      preferredGender: req.body.preferredGender,
      interest: req.body.interest
    }
    userModel.updateOne({_id: req.body._id}, {$set: updateUser})
    .then(result =>{
     res.render("index.ejs", result);
    }) 
    .catch( err => {
     res.status(500).json({
         error: err 
       })
   })
}


exports.likes = async (req,res) => {

  var secondId = req.body.second_id;
  var userArray = req.body.userArray.split(",");
  //var secondArray = like.likes.split(", "); 

  if (req.body.like != undefined){
    //res.send("It's a match!")
    //if (userArray.includes(secondId) && like.likes.includes(req.params.id)){
      //console.log ("it's already a match")
    //}
    await userModel.updateOne({_id: req.params.id}, {$push: {"likes": secondId}}) 
    
     userModel.findOne(({_id: secondId}))                          
    .then(like => {  
      console.log(req.params.id, secondId, userArray, like.likes) 
      if (userArray.includes(secondId) && like.likes.includes(req.params.id)) {

        console.log("match")
      } else console.log("no match")
       res.status(200).render("../Views/homepage.ejs");
      })
    .catch(err => {
    res.status(500).json({
      error: err 
    })
 })
 
  }
  //req.paras.ID er burger 1' ID
  //secondID bruger 1 likes 
  // secondID er bruger 2' ID
  //like.likes er bruger 2' like-list
  // userArray er bruger 1' like-list



// 



  /*
    if (req.body.like != undefined){
      console.log("bruger liket")
      userModel.find({email: req.body.email})
        .then(result =>{
          console.log(result)
          result[0].likes.push(req.body.match_id)
          //console.log(result[0].likes)
          result.save()
          .then(newUser => {
            if (newUser) {
              console.log(newUser)
              res.render("matches.ejs")
            } else {res.status(500).send(
              "kæmpe fejl"
            )}
          })
          .catch(err => {
            if (err) {
              res.status(500).json({
                error: err 
              })
            }
            
          })
          
        })
          .catch( err => {
              res.status(500).json({
                  error: err 
                })
            
          })
        } else if (req.body.dislike != undefined){
      console.log("Bruger disliked");
    }  
    */
}
