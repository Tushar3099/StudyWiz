const express=require('express');
const app=express();
const bodyParser=require("body-parser");
const cors=require('cors');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose=require("mongoose");
const mailer = require('nodemailer')
const cookieParser = require('cookie-parser')
const seeder = require("./seeder");
const formatDistanceToNow = require('date-fns/formatDistanceToNow');
require('dotenv').config();
const middleware = require('./middleware/middle');
const indexRoutes=require('./routes/index');
const likesRoutes=require('./routes/likes');
const discussRoutes=require('./routes/discuss');
const commentRoutes=require('./routes/comment');
const uploadRoutes=require('./routes/upload');
const answerRoutes=require('./routes/answer');
const registerRoutes=require('./routes/register');
const loginRoutes=require('./routes/login');
const searchRoutes=require('./routes/search.js');
const faker = require("faker");

mongoose.connect("mongodb://localhost/bot_kill",{useNewUrlParser:true,useUnifiedTopology: true});

app.use(cors());
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json({limit : '1mb'}))
app.use(middleware)

seeder()

//routes

app.use(indexRoutes);
app.use(answerRoutes);
app.use(commentRoutes);
app.use(discussRoutes);
app.use(likesRoutes);
app.use(uploadRoutes);
app.use(loginRoutes);
app.use(registerRoutes);
app.use(searchRoutes);

app.listen("3000",()=>{
    console.log("server is listening!");
});