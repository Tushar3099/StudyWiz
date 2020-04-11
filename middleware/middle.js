const User = require('../models/users')
const jwt = require('jsonwebtoken')
const middle =  async (req,res,next)=>{
                const token = req.cookies.token;
                // console.log(token);
                if(!token){
                    // console.log('I m NOT in try catch')
                    res.locals.currentUser = null;
                    res.locals.url = req.url;
                    return next();
                }

                var payload;

                try {
                    // console.log('I m in try Catch')
                    payload = jwt.verify(token,process.env.TOKEN_ACCESS_SECRET)
                    // console.log('I m finding the payload')
                    await User.findById(payload.id , (err,user)=>{
                        if(err)
                        res.send({error : err})
                        else{
                            // console.log('I m setting up currentUser')
                            res.locals.currentUser = user;
                            res.locals.url = req.url;
                            req.user = user;
                            // console.log(req.url)
                            // console.log(res.locals.currentUser)
                        }
                    })
                } catch (err) {
                    if(err instanceof jwt.JsonWebTokenError )
                    return res.status(401).send({error : err})
                    else
                    return res.status(400).send({error : err})
                }

                return next();

            }
module.exports = middle;