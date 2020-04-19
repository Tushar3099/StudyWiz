const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const mailer=require('nodemailer');
const jwt=require('jsonwebtoken');
const fetch = require('node-fetch');

const User=require('../models/users.js');

router.get('/profile/:id',(req,res)=>{
    res.render('profile');
});

router.put('/profile/:id',async(req,res)=>{

    User.findById(req.params.id,async(err,user)=>{
        if(err)
        res.send(err);
        else
        {
            const prevEmail=user.email;
           
            if(prevEmail!=req.body.email)
            {
                // const reqEmail={email: req.body.email};
        // await fetch('http://localhost:3000/profile/'+user._id, {
        //     method: 'get',
        //    // body:    JSON.stringify(reqEmail),
        //     headers: { 'Content-Type': 'application/json' },
        //  })
        //  .then(console.log(res))
        // //  .then(json => console.log(json))
        //  .catch(function (err) {
        //     console.log('node-fetch error: ', err)
        //   })

               
                res.redirect('/verifyNew/'+user._id+'/'+req.body.email)
        
            }
            else
            {
                const user={
                    username:req.body.username,
                    email:req.body.email,
                    info:{
                        bio:req.body.bio,
                     occupation:{
                         company:req.body.company,
                         desig:req.body.desig
                     },
                     education:{
                         institute:req.body.institute,
                         course:req.body.course
                     },
                     handles:{
                         twitter:req.body.twitter,
                         github:req.body.github,
                         linkedin:req.body.linkedin
                     }
                    }
                }
             
                await User.findByIdAndUpdate(req.params.id,user,(err,updatedUser)=>{
                    if(err)
                    {
                        res.send(err)
                    }
                    else 
                    {
                        res.redirect("/profile/"+req.params.id);
                    }
                })
             }
            } 
        })       
        
    });
   
   
router.get('/verifyNew/:id/:email',(req,res)=>{
User.findById(req.params.id,async(err,user)=>{
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
        //console.log(user)

        const info = {
            username : user.username,
            id : user._id,
            expiry :  new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
        }
        var email=req.params.email;
        var token = jwt.sign(info,process.env.TOKEN_ACCESS_SECRET,{ expiresIn: '1h' });
        // const reqEmail={email: req.body.email};
        // await fetch('http://localhost:3000/profile/'+user._id, {
        //     method: 'get',
        //    // body:    JSON.stringify(reqEmail),
        //     headers: { 'Content-Type': 'application/json' },
        //  })
        //  .then(console.log(res))
        // //  .then(json => console.log(json))
        //  .catch(function (err) {
        //     console.log('node-fetch error: ', err)
        //   })

        var mailOptions = {
            from : "noreply<process.env.SERVER_MAIL_ADDRESS>",
            to : email,
            subject : "Welcome to TEST",
            text : 'Visit this http://localhost:3000/token_verify/edited/'+token+'/'+email,
            html : '<a href="http://localhost:3000/token_verify/edited/'+token+'/'+email+'"><H2>Click on this</H2></a>'
        }
        // var reqEmail={email:req.body.email};
        // await fetch('http://localhost:3000/token_verify/edited/'+token, {
        //     method: 'post',
        //     body:    JSON.stringify(reqEmail),
        //     headers: { 'Content-Type': 'application/json' },
        //  })
        //  .then(res => res.json())
        //  .then(json => console.log(json));

        transport.sendMail(mailOptions,function(email_err,email_data){
            if(email_err){
                console.log(email_err);
                res.json(email_err);
            }else{
                console.log(email_data)
                console.log("http://localhost:3000/token_verify/edited/" + token+'/'+email);
                res.send('<h3>Email has been sent to use mail id : ${email} for verification.</h3>');
            }
        });
    }
})
});

router.get('/token_verify/edited/:token/:email',(req,res)=>{
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
                user.email=req.params.email;
                await user.save();
                console.log(user)
                res.redirect('/profile/'+user._id)
            }  
        })

        // User.updateOne(decoded.id,{ isverified : true }).exec(()=>{
        //     res.redirect('/login')
        // })
    }
})
})

module.exports=router;