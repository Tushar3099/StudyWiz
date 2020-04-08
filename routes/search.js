const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');

const post=require('../models/post.js');

router.post('/search',(req,res)=>{
    var query = req.body.query;

    post.find({ $text: { $search: query } })
        .populate('answer')
        .limit(25)
        .exec((err,allPost)=>{

            if(err)
            console.log(err)
            else{
              res.render("discuss",{allPost : allPost});  
            }
        // console.log(allPost)
        })

});

module.exports=router;