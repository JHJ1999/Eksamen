const express = require("express"); // kalder express
const cors = require("cors");
const app = express(); // benytter express
const port = 3000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./Routes/userRoutes");
const ejs = require("ejs");
const session = require("express-session");
const cookieParser = require("cookie-parser");

mongoose.connect("mongodb+srv://eksamen:eksamen@cluster0.uuj1t.mongodb.net/Cluster0?retryWrites=true&w=majority",{ 
  useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true }
);//connecter til mongoDB cluster


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("database connected");
});

app.set("view engine", "ejs");


app.use("/routes", userRoutes); // henviser til mine userRoutes
app.use(cors());
app.use(express.static("./Views/")); // for at hente HTML/CSS til view engine

app.use(cookieParser());
app.use(
  session({
    key: "user",
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { expires: 700000 },
  })
);

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.listen(port, () => {
  console.log(`App kører på http://localhost:${port}`);
});
