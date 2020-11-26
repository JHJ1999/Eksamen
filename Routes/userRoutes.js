const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({urlencoded: true}));

router.use(express.static("./Views/")); // for at hente HTML/CSS til view engine 
 //sætter view engine til ejs


const loginController = require('../Controllers/Users');

const signupController = require('../Controllers/Users');

const deleteController = require('../Controllers/Users');

const likesController = require('../Controllers/Users');

const updateController = require('../Controllers/Users');


router.post('/signup', signupController.signup);
  
router.post('/delete', deleteController.delete);

router.post('/likes', likesController.likes);  

router.post('/update', updateController.update);

router.post('/login', loginController.login);


module.exports = router;