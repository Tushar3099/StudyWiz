const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');

const post=require('../models/post');
const answer=require('../models/answer');
const comment=require('../models/comment');


router.post("/discuss/comment/:postid/:answerid",(req,res)=>{
    answer.findById(req.params.answerid,(err,answer)=>{
        if(err)
        console.log(err)
        else{
        comment.create({},(err,comment)=>{
             if(err)
             console.log(err)
             else{
             comment.creater.username = req.user.username;
             comment.creater.user = req.user;
             comment.text = req.body.comment;
             comment.save() ;
             answer.comment.push(comment);
             answer.save()
             // console.log(answer)
             res.redirect("/discuss/question/" + req.params.postid)
             }
         
         })    
     // console.log(answer);
    }
 })
 
 })

 
 module.exports=router;