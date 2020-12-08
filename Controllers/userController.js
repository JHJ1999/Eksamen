const userModel = require("../Model/User");
const mongoose = require("mongoose");

exports.login = (req, res) => {
  if (req.body != null) {
    userModel
      .find({ email: req.body.email })
      .then((users) => {
        if (users.length < 1) {
          res.send("No user found");
        } // tjekker om det er admin- eller user login
        if (
          users[0].role == req.body.role &&
          users[0].password == req.body.password
        ) {
          if (users[0].role == "admin") {
            userModel
              .find({ role: "user" }) //henter liste af users til admin side
              .then((allUsers) => {
                res.status(200).render("homepage.ejs", {
                  admin: users[0],
                  allUsers: allUsers,
                });
              })
              .catch((err) => {
                res.status(500).json({
                  error: err,
                });
              });
          } else if (users[0].role == "user") {
            userModel
              .find({ email: { $ne: req.body.email } }) //ne (not equal) til brugerens email, så man ikke viser sin egen bruger som et muligt match
              .then((userList) => {
                var randomUser = Math.floor(Math.random() * userList.length);
                res.status(200).render("homepage.ejs", {
                  user: users[0],
                  userList: userList[randomUser],
                }); //for at vise tilfældige users
              });
          } else {
            res.status(200).json(users[0]);
          }
        } else {
          res.status(403).json({ message: "unauthorised" });
        }
      })
      .catch((err) => {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          res.status(404).json({ error: "error" });
        }
      });
  }
};

exports.signup = (req, res) => {
  const newUser = new userModel({
    role: "user",
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    age: req.body.age,
    gender: req.body.gender,
    preferredGender: req.body.preferredGender,
    interest: req.body.interest,
    likes: [],
    matches: [],
  });

  newUser
    .save()
    .then((user) => {
      userModel
        .find({ email: { $ne: req.body.email } }) //ne (not equal) til brugerens email, så man ikke får vist sin egen bruger som et muligt match
        .then((userList) => {
          var randomUser = Math.floor(Math.random() * userList.length);
          res.status(200).render("homepage.ejs", {
            user: user,
            userList: userList[randomUser],
          }); //for at vise tilfældige users
        })
        .catch((err) => {
          res.status(404).json({ error: err });
        });
    })
    .catch((err) => res.status(500).json({ error: err }));
};

exports.delete = (req, res) => {
  userModel
    .findByIdAndRemove(req.body.id)
    .exec()
    .then((doc) => {
      if (!doc) {
        return res.status(404).end();
      }
      return res.status(200).render("index.ejs");
    }) //ellers 204.end()
    .catch((err) => next(err));
};

exports.update = (req, res) => {
  var updateUser = {
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
    gender: req.body.gender,
    preferredGender: req.body.preferredGender,
    interest: req.body.interest,
  };
  userModel
    .updateOne({ _id: req.body._id }, { $set: updateUser })
    .then((result) => {
      res.render("index.ejs", result);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.likes = async (req, res) => {
  var secondId = req.body.second_id;
  var userArray = req.body.second_id;

  if (req.body.like != undefined) {
    await userModel.updateOne(
      { _id: req.params.id },
      { $addToSet: { likes: secondId } }
    ); //addToSet tilskriver kun ID'et, hvis det ikke allerede er i arrayet.

    const like = await userModel.findOne({ _id: secondId });

    await userModel.updateOne(
      { _id: req.params.id },
      { $addToSet: { matches: secondId } }
    );

    if (userArray.includes(secondId) && like.likes.includes(req.params.id)) {
      res.status(200).send("It's a match"); //indlæse samme side
      console.log("match");
    } else console.log("no match");
    res.status(200).send("It's not a match");
  }
};

exports.matches = async (req, res) => {
  var userMatches = [];

  if (req.body.matches != undefined) {
    const myUser = await userModel.findOne({ _id: req.params.id }); //bruger hvis matches jeg vil finde/vise

    if (myUser) {
      userMatches = myUser.matches;
    }
    const matches = await userModel.find({ _id: { $in: userMatches } }); //finder id's i usermatches

    res.render("matches.ejs", {
      matches: matches,
      userMatches: userMatches,
      myUser: myUser,
    });
  } else console.log("virker ikke");
  res.status(200);
};

exports.matchesDelete = async (req, res) => {
  var userId = req.params.id;
  var matchID = req.body.id;
  console.log(userId, matchID);

  await userModel.updateOne(
    { _id: req.body.id },
    { $pull: { matches: { $in: req.params.id } } }
  );
  await userModel.updateOne(
    { _id: req.params.id },
    { $pull: { likes: { $in: req.body.id } } }
  );
  await userModel
    .updateOne(
      { _id: req.params.id },
      { $pull: { matches: { $in: req.body.id } } }
    )
    .then(res.send("Match fjernet"));
};

/*
    const user = await userModel.findOne({_id: req.params.id});
    const otherUser = await userModel.findOne({_id: req.body._id});

    var userMatches = user.matches;
    var userLikes = user.likes;
    console.log(userMatches, userLikes)
*/

//jeg skal bruge likes for bruger jeg er logget ind med
// jeg skal bruge matches for match(x) og for bruger der er logget ind

/* 
 for(i=0; i < user.likes.length; i++) {

      if(user.likes[i] = req.body.deleteMatch) {

        user.likes.splice(i, 1);

      }

    }

    for(i=0; i < user.matches.length; i++) {

      if(user.matches[i] = req.body.deleteMatch) {

        user.matches.splice(i, 1);

      }

    } user.updateOne({_id: req.params.id, $set: user});

    if(otherUser) {

      for(i=0; i < otherUser.matches.length; i++) {

        if(otherUser.matches[i] = req.params.id) {
  
          otherUser.matches.splice(i, 1);
  
        }
  
      }

    } otherUser.updateOne({_id: req.body.deleteMatch, $set: otherUser})

    res.status(200).json({"newMatches": user.matches});

  } 
}


    for(i=0; i < user.matches.length; i++) {

      if(user.matches[i] = req.body.id) {

        userModel.update({_id: req.params.id}, {matches: splice(i, 1)});

      }

    }
    for(i=0; i < user.likes.length; i++) {

      if(user.likes[i] = req.body.id) {

        user.likes.splice(i, 1);

      }

    }



  userModel.findOne({_id: req.params.id})
  .then (userModel_id => {
    userModel.find({_id: {$in: userModel_id.matches}})
    .then( matches => { 
        res.render('matches.ejs', {'matches': matches})
        })
        .catch( err => {
        res.status(404).json({
          error: err
        });
        });
  });
 };

    

    //await userModel.find({_id: {$in: userMatch.matches}}) // de matches jeg vil vise 

     //const matches = userMatch.matches;
     //console.log(matches)
     //usermatch er den rigtige bruger, jeg vil gerne have vist denne brugers matches 

  if (req.body.matches != undefined){

  var userMatch = await userModel.findOne({_id: req.params.id}) //bruger hvis matches jeg vil finde/vise 
  var matches = await userModel.find({_id: {$in: userMatch.matches}}) // de matches jeg vil vise 
  console.log(userMatch, matches) //usermatch er den rigtige bruger, jeg vil gerne have vist denne brugers matches 
  res.render('matches.ejs', {"matches": matches}, {"userMatch": userMatch})


  try {
    
  const users = await userModel.findOne({_id: req.params.id})
  const matches = await userModel.find({_id: {$in: user.matches}})
  console.log(users,matches)
  res.render("matches.ejs", {users: users}, {matches: matches});
    
  } catch (err) {
  res.status(404).send('No matches')
 }
  }  }
  //var user = req.params.id;
  // var matches = userModel.find({_id: {$in: userModel.matches}})

 
   

   // else( err => {
     // res.status(500).json({
       //   error: err 
    //    })
    //})
 //} 
 

  })
 if (err){
  console.log(err)
 }
 else {
  res.status(200).render("../Views/matches.ejs", )
 }
 //userModel.updateOne({_id: req.params.id}, {$addToSet: {"matches": secondId}})

  //req.paras.ID er burger 1' ID
  //secondID bruger 1 likes 
  // secondID er bruger 2' ID
  //like.likes er bruger 2' like-list
  // userArray er bruger 1' like-list

  //res.send("It's a match!")
    //if (userArray.includes(secondId) && like.likes.includes(req.params.id)){
      //console.log ("it's already a match")
    //}
 //var userArray = req.body.userArray.split(",");
  //var secondArray = like.likes.split(", "); 

 




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
