const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const bodyParser=require("body-parser");

const post=require('../models/post');
const answer=require('../models/answer');

router.use(bodyParser.urlencoded({extended:true}));
router.use(express.json({limit : '1mb'}))



router.get("/discuss/answer",(req,res)=>{
    post.find({},(err,allPost)=>{
        if(err)
        console.log(err)
        else{
          res.render("question",{allPost : allPost});  
        }  
    })
})

router.get("/discuss/answer/:id",(req,res)=>{
    
    post.findById(req.params.id,(err,post)=>{
        if(err)
        console.log(err)
        else
        res.render("newAns.ejs",{post : post});
    })
       
})

router.post("/discuss/answer/:id",(req,res)=>{
    // console.log(req.file);
    post.findById(req.params.id,(err,post)=>{
        if(err)
        console.log(err)
        else{
            answer.create({},(err,answer)=>{
            answer.creater.username = req.user.username;
            answer.creater.user = req.user;
            answer.content= JSON.stringify(req.body.blocks);
            answer.save() 
            post.answer.push(answer);
            post.save()
            console.log(post)
            console.log(answer)
            res.redirect("/discuss")
        })
      }
    })
})


module.exports=router;