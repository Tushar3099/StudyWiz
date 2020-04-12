const express=require('express');
const router=express.Router();
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const User = require('../models/users')
const jwt = require('jsonwebtoken')

router.use(cookieParser())

router.get("/login",(req,res)=>{
    res.render("login",{message : null});
});


router.post('/login',async (req,res)=>{
    try {
            const user = await User.findOne({username : req.body.username}).exec();
            
        if(!user){
            res.render("login",{ message: "The username does not exist" })
        }   
                // console.log(user)
        // console.log(req.body.password)
        // console.log(user.password)
        if(await bcrypt.compare(req.body.password , user.password)){
            if(user.isverified){
                const token = jwt.sign({
                    username : user.username,
                    id : user._id,
                },process.env.TOKEN_ACCESS_SECRET,{ expiresIn: '10 days' });

                console.log('token:', token)

                res.cookie('token', token, { maxAge: 10*60*60*24* 1000 })
                res.redirect('/');
            }
            else{
                res.render('verify' , { id : user._id})
            }
        }

        else{
            res.render("login",{ message: "Password is incorrect" })
        }
    } catch (error) {
        console.log(error)
        res.send("Something went wrong")
    }
    
            
})

router.get('/logout',(req,res)=>{
    res.clearCookie('token').redirect('/')
})



module.exports=router;