//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const app = express();
var encrypt = require('mongoose-encryption'); 

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", async function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    const foundUser = await User.findOne({email: username});
    if (foundUser === null){
        res.render("login");
    } else if (foundUser.password === password) {
        res.render("secrets");
    } else {
        res.render("login");
    }
   
});

app.get("/register", function(req, res){
    res.render('register');
});

app.post("/register", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    const newUser = new User({
        email: username,
        password: password
    });
    newUser.save().then(() => res.render("secrets"));
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});