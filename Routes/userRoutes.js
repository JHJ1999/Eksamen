const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({urlencoded: true}));

router.use(express.static("./Views/")); // for at hente HTML/CSS til view engine 
 //sætter view engine til ejs


const loginController = require('../Controllers/userController');

const signupController = require('../Controllers/userController');

const deleteController = require('../Controllers/userController');

const likesController = require('../Controllers/userController');

const updateController = require('../Controllers/userController');


router.post('/signup', signupController.signup);
  
router.post('/delete', deleteController.delete);

router.post('/:id/likes', likesController.likes);  

router.post('/update', updateController.update);

router.post('/login', loginController.login);


module.exports = router;