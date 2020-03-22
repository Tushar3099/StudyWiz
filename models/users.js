
const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");

var userSchema=new mongoose.Schema({
  
  name: {
    type: String,
    required: true,
    trim: true
      },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: value => {
        if (!validator.isEmail(value)) {
            throw new Error({error: 'Invalid Email address'})
        }
    }
},
   password: {
    type: String,
    required: true,
    minLength: 7
},
   tokens: [{
    token: {
        type: String,
        required: true
    }
}],
            image : { 
              type : String ,
              default: "https://cdn2.vectorstock.com/i/thumb-large/17/61/male-avatar-profile-picture-vector-10211761.jpg"
            },
            date: {
                type: Date,
                default: Date.now
              },
              isVerified: {type: Boolean,default: false}

})

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);