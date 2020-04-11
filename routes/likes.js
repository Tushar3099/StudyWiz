const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const answer = require("../models/answer");

router.get("/likes/:id",(req,res)=>{
    answer.findByIdAndUpdate({_id : req.params.id},{ $inc : { "like.count" : 1  } }).exec((err,answer)=>{
        if(err)
        console.log(err)
        else{
            answer.like.user.push(req.user);
            answer.save()
            //    console.log(answer);
            res.redirect("back"); 
            }
            
        }
    )

})

router.get("/unlikes/:id",(req,res)=>{
    answer.findByIdAndUpdate({_id : req.params.id},{ $inc : { "like.count" : -1  } }).populate({path : "like.user"}).exec((err,answer)=>{
        if(err)
        console.log(err)
        else{console.log(answer.like.user.length);
            for( var i = 0; i < answer.like.user.length; i++){ 
                if ( answer.like.user[i].username == req.user.username) {
                  answer.like.user.splice(i, 1); 
                }
             }
            answer.save();
            // console.log(answer);
            res.redirect("back");
        }
    })

})
 

module.exports=router;