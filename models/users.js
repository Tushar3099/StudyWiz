
const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");

var userSchema=new mongoose.Schema({
  
            username:String,
            email:String,
            password:String,
            image : { 
              type : String ,
              default: "https://cdn2.vectorstock.com/i/thumb-large/17/61/male-avatar-profile-picture-vector-10211761.jpg"
            },
            date: {
                type: Date,
                default: Date.now
              }

})

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);