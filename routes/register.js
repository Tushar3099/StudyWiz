const express=require('express');
const router=express.Router();
const jwt = require('jsonwebtoken')
const mongoose=require('mongoose');
const bodyParser = require("body-parser")
const bcrypt = require('bcrypt')
const mailer=require('nodemailer');
require('dotenv').config();

const User=require('../models/users.js');


router.get("/register",(req,res)=>{
    res.render("register");
});


router.post("/register",async (req,res)=>{
    const salt = await bcrypt.genSalt(); 
    const hashPassword = await bcrypt.hash(req.body.password , salt)
    const user = {
        username : req.body.username,
        password : hashPassword,
        email : req.body.email
    }

    User.create(user,(err,user)=>{
        if(err)
        console.log(err);
        else{
           res.redirect('/verify/'+user._id)
        }
    })
    
});

router.get('/verify/:id',(req,res)=>{

   User.findById(req.params.id,(err,user)=>{
       if(err)
       res.send({error : err})
       else{

           var transport = mailer.createTransport({
               service : "Gmail",
               auth : {
                   user : process.env.SERVER_MAIL_ADDRESS,
                   pass : process.env.SERVER_PASSWORD
               }
           });
           console.log(user)

           const info = {
               username : user.username,
               id : user._id,
               expiry :  new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
           }
           var token = jwt.sign(info,process.env.TOKEN_ACCESS_SECRET,{ expiresIn: '1h' });

           var mailOptions = {
               from : "Tushar <process.env.SERVER_MAIL_ADDRESS>",
               to : user.email,
               subject : "Welcome to TEST",
               text : 'Visit this http://localhost:3000/token_verify/'+token,
               html : '<a href="http://localhost:3000/token_verify/'+token+'"><H2>Click on this</H2></a>'
           }

           transport.sendMail(mailOptions,function(email_err,email_data){
               if(email_err){
                   console.log(email_err);
                   res.json(email_err);
               }else{
                   console.log(email_data)
                   console.log("http://localhost:3000/token_verify/" + token);
                   res.send(`<h3>Email has been sent to use mail id : ${user.email} for verification.</h3>`);
               }
           });
       }
   })
})

router.get('/token_verify/:token',(req,res)=>{
   const token = req.params.token;
   jwt.verify(token,process.env.TOKEN_ACCESS_SECRET,(err,decoded)=>{
       if(err){
           res.status(401).send({message : err.message})
       }
       else{
           // console.log(decoded)
           User.findById(decoded.id,async (err,user)=>{
               if(err)
               res.send({err : err})
               else{
                   user.isverified = true;
                   await user.save();
                   console.log(user)
                   res.redirect('/login')
               }
           })

           // User.updateOne(decoded.id,{ isverified : true }).exec(()=>{
           //     res.redirect('/login')
           // })
       }
   })
})
module.exports= router;
