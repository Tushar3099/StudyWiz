const express=require('express');
const app=express();
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const passport=require("passport");
const LocalStrategy=require("passport-local").Strategy;
const passportLocalMongoose=require("passport-local-mongoose");
const multer  = require('multer');
const FacebookStrategy = require('passport-facebook');
//const cookieSession = require('cookie-session');
//const cookieParser = require('cookie-parser');
const seeder = require("./seeder");
const nodemailer = require("nodemailer");
const formatDistanceToNow = require('date-fns/formatDistanceToNow');
const jwt=require('jsonwebtoken');
require('dotenv').config();
const bcrypt=require('bcrypt');


seeder()

//upload
const storage = multer.diskStorage({
    destination: function (req, file, next) {
     next(null, "./public/upload")
    },
    filename: function (req, file, next) {
      next(null, file.fieldname + '-' + Date.now() +".jpg" )
    }
  })
const upload = multer({ 
    storage: storage ,
    preservePath : true
})

//models
var post = require("./models/post"),
    answer = require("./models/answer"),
    comment = require("./models/comment"),
    fbUser = require("./models/fbuser"),
    User = require("./models/users.js")

app.use(require("express-session")({
    secret:"its secret",
    resave:false,
    saveUninitialized:false
}));

mongoose.connect("mongodb://localhost/bot_kill",{useNewUrlParser:true,useUnifiedTopology: true});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json({limit : '1mb'}))
app.set("view engine","ejs");

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
// passport.use(new LocalStrategy(
//     function(username, password, done) {
//       User.findOne({ username: username }, function (err, user) {
//         if (err) { return done(err); }
//         if (!user) { return done(null, false); }
//         if(user.password != password){return done(null,false)}
//         return done(null, user);
//       });
//     }
//   ));
passport.use(new FacebookStrategy({
    clientID : "522599441684037",
    clientSecret : "f6ee5def1dc88e4a64c5a36ab307e6f6",
    callbackURL  : "http://localhost:3000/auth/facebook/callback",
    profileFields : ['emails','name','id']
},(accessToken,refreshToken,profile,done)=>{
    process.nextTick(()=>{
        fbUser.findOne( {id : profile.id},(err,user)=>{
            if(err)
            done(err);
            if(user)
            done(null,user);
            else{
                fbUser.create({
                    id : profile.id ,
                    username : profile.name.givenName + " " + profile.name.familyName ,
                    email : profile.email[0].value,
                    token : accessToken
                },(err,user)=>{
                    if(err)
                    throw err
                    done(null,user)
                })    
            }
        } )

    })

}))


// passport.serializeUser(fbUser.serializeUser());
// passport.deserializeUser(fbUser.deserializeUser());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// passport.serializeUser((user,done)=>{
//     done(null,user.id)
// })
// passport.deserializeUser((id,done)=>{
//     User.findById(id).then((err,user)=>{
//         done(err,user);
//     })
// })

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.imgUpload = req.file;
    next();     
});

// ROUTES------------
app.get("/",(req,res)=>{
    res.render("home.ejs")
})

//Upload Routes

app.post('/uploadFile',upload.single('image'),(req,res)=>{
    try {
        console.log(req.file);
        const imgInfo = {
            "success" : 1,
            "file": {
            "url" : `http://localhost:3000/upload/${req.file.filename} `,
            }
        }
        res.send(imgInfo)
    } catch (error) {
        res.send(400);
    }
})

app.get('/upload/:id',(req,res)=>{
    const image = require('./public/upload/'+ req.params.id)
    res.send(image);
})

// Discuss Routes
app.get("/discuss",(req,res)=>{

    post.find().populate("answer").exec((err,allPost)=>{

        if(err)
        console.log(err)
        else{
          res.render("discuss",{allPost : allPost});  
        }
    // console.log(allPost)
    })
})
 


app.get("/discuss/question/new",isLoggedIn,(req,res)=>{
    res.render("new.ejs")
})

app.post("/discuss/question",isLoggedIn,(req,res)=>{
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

app.get("/discuss/question/:id",(req,res)=>{
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

//Like Dislike Routes

app.get("/likes/:id",(req,res)=>{
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

app.get("/unlikes/:id",(req,res)=>{
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

//Answer Routes

app.get("/discuss/answer",isLoggedIn,(req,res)=>{
    post.find({},(err,allPost)=>{
        if(err)
        console.log(err)
        else{
          res.render("question",{allPost : allPost});  
        }  
    })
})

app.get("/discuss/answer/:id",isLoggedIn,(req,res)=>{
    
    post.findById(req.params.id,(err,post)=>{
        if(err)
        console.log(err)
        else
        res.render("newAns.ejs",{post : post});
    })
       
})

app.post("/discuss/answer/:id",(req,res)=>{
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

// Commnet Routes

app.post("/discuss/comment/:postid/:answerid",(req,res)=>{
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

// Auth Routes

app.get("/register",(req,res)=>{
    res.render("register");
});
app.post("/register",async(req,res)=>{
    // var image=req.body.image;
    
    // var newUser=new User({username:req.body.username,email:req.body.email});
    // User.register(newUser,req.body.password,(err,user)=>{
    //     if(err){
    //         console.log(err);
    //         return res.render("register");
    //     }
    //     else{
    //         if(image!==""){
    //             user.image = image;
    //         }
    //         passport.authenticate("local")(req,res,()=>{
    //             res.redirect("/send");
    //         })
    //     }
        
    // })
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(req.body.password , salt)
    const user={
        username:req.body.username,
        password:hashPassword,
        email:req.body.email
    }

    User.create(user,(err,user)=>{
        if(err)
        console.log(err);
        else{
            var transport=nodemailer.createTransport({
                service:"Gmail",
                auth:{
                    user: process.env.SERVER_MAIL_ADDRESS,
                    pass: process.env.SERVER_PASSWORD
                }
            });
            //console.log(user);

            const info={
                username: user.username,
                id:user._id,
                expiry :  new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
            }
            var token=jwt.sign(info,process.env.token_access_secret,{expiresIn:'1h'});
            //console.log(token);

            var mailOptions={
                from:"noreply <process.env.SERVER_MAIL_ADDRESS>",
                to: user.email,
                subject:"Email verification",
                text : 'Visit this http://localhost:3000/verify/'+token,
               html : '<a href="http://localhost:3000/verify/'+token+'"><H2>Click on this link to verify your email!!</H2></a>'
            }
            console.log(mailOptions);

            transport.sendMail(mailOptions,(email_err,email_data)=>{
                if(email_err){
                    console.log(email_err);
                    res.json(email_err)
                }
                 else{
                   console.log("http://localhost:3000/verify/" + token);
                   res.send('<h3>email sent</h3>');
                }
            })

        }
    })

});

app.get('/verify/:token',(req,res)=>{
    const token=req.params.token;
    jwt.verify(token,process.env.token_access_secret,(err,decoded)=>{
        if(err){
            res.status(401).send({message: err.message})
        }
        else{
            console.log(decoded);
            User.findById(decoded.id,(err,user)=>{
                if(err)
                res.send({err:err})
                else{
                    user.isVerified=true;
                    user.save((err,user)=>{
                        if(err)
                        console.log(err);
                        else
                        console.log(user);
                    })
                    res.redirect('/login')
                }
            })
        }
    })

})


app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/send",(req,res)=>{

    const output = `
        <strong>Message</strong>
        <p>${req.user.username}, you have successfully registered in to the StudyWizard app</p>
        <p>Unleash the world of technology at your hand....Stay Tuned!!</p>
    `
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: "tavk017@gmail.com", 
              pass: "itsconfusing@123"
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
                }
          });
        
          let info = transporter.sendMail({
            from: '"Tushar" <tavk017@gmail.com>', // sender address
            to: req.user.email , // list of receivers
            subject: "Login Verification", // Subject line
            text: "You have been successfully logged in?", // plain text body
            html:       output // html body
          },(err,info)=>{
            if(err)
            console.log(err);
            console.log("Message sent: %s", info.messageId);
        
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            res.redirect("/discuss");
          });
        
          
})

app.post("/login",passport.authenticate("local",{
    successRedirect: "/discuss",
    failureredirect:"/login"
}),(req,res)=>{
});

app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/discuss");
});

app.get('/auth/facebook', passport.authenticate('facebook',{ scope : ['email']}));

app.get("/done",(req,res)=>{
    res.send("FB Authentication done")
})

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } res.redirect("/login");
}

app.listen("3000",()=>{
    console.log("server is listening!");
});