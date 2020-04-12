
const mongoose=require("mongoose");
const validator = require('validator')

var userSchema=new mongoose.Schema({

  // isVerified: {type: Boolean,default: false}
  // username : String,
  // password : String,
  // email : String,
  
  username: {
    type: String,
    required: true,
    trim: true
      },
  email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
  password: {
    type: String,
    required: true,
    minLength: 7
    },
  image : {
    type : String,
    default : "https://www.bsn.eu/wp-content/uploads/2016/12/user-icon-image-placeholder.jpg",
  },

  info:{
    bio:{type: String},
  education:{
    institute:{type:String},
    course:{type:String}
  },
  occupation:{
    company:{type:String},
    desig:{type:String}
  },
  handles:{
    twitter:{type:String},
    github:{type:String},
    linkedin:{type:String}
  }
  },

  isverified : {type : Boolean , default : false}

})

module.exports=mongoose.model("User",userSchema);