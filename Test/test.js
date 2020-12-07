const mongoose = require("mongoose");
const userModel = require("../Model/User");
const mocha = require("mocha");
const assert = require("assert");

describe("create new user", function () {
  it("Should create a new user and add it to the DB", function (done) {
    //arrange
    var newUser = new userModel({
      role: "User",
      name: "Test",
      email: "Test@gmail",
      password: "Test",
      age: "1",
      gender: "Male",
      preferredGender: "Female",
      interest: "Testing",
      likes: "Tests",
      matches: "tests",
    }); // gemmer i en variabel (newuser)

    //act
    newUser
      .save()
      .then(function () {
        assert(!newUser.isNew); // assert, (isNew)boolean giver true, når brugeren er oprettet, men false, når brugeren er gemt i DB
        done();
      })
      .catch(done);
  });
});
