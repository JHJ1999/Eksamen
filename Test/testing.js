var expect = require('chai').expect;
var power = require('../index')

describe('delete()', function (){
    it('Should delete an already existing user from the DB', function (){
        //arrange




        //act


        //assert
    });

    it('Should throw an error', function (){

    })
})

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
