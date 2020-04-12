const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');

const User=require('../models/users.js');

router.get('/profile/:id',(req,res)=>{
    res.render('profile');
});

router.put('/profile/:id',async(req,res)=>{
   const user={
       username:req.body.username,
       email:req.body.email,
       bio:req.body.bio,
       info:{
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
})

module.exports=router;