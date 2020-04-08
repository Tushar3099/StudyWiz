const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const formatDistanceToNow = require('date-fns/formatDistanceToNow');

const post=require('../models/post');


router.get("/discuss",(req,res)=>{
    console.log(req.user)
    post.find().populate("answer").exec((err,allPost)=>{

        if(err)
        console.log(err)
        else{
          res.render("discuss",{allPost : allPost});  
        }
    // console.log(allPost)
    })
})
 


router.get("/discuss/question/new",(req,res)=>{
    res.render("new.ejs")
})

router.post("/discuss/question",(req,res)=>{
   post.create({
       question : req.body.question
   },(err,post)=>{
       if(err){
           console.log(err)
        //    return res.redirect("back")
       }
       else{
           post.creater.username = req.user.username;
           post.creater.id = req.user.id;
           post.save();
        //    console.log(post);
           res.redirect(301,"/discuss");
       }
   })
})

router.get("/discuss/question/:id",(req,res)=>{
    post.findById(req.params.id).populate({
        path : "answer",
        populate : {
             path : "comment",
             populate : "creater.user"
    }
    }).populate({
        path : "answer",
        populate : { path : "like.user"}
    }).populate({
        path : "answer",
        populate : { path : "creater.user"}
    }).exec((err,post)=>{
        if(err)
        console.log(err) 
        else{
            // console.log(post);
            var Time = [];
            post.answer.forEach(answer => {
                var time = formatDistanceToNow( answer.date , { includeSeconds: true });
                Time.push(time);
            });
            res.render("show.ejs",{post : post, time : Time})
            }
        })
           
    })
 

    module.exports=router;
