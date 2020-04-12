
const mongoose=require("mongoose");
const validator = require('validator')

var userSchema=new mongoose.Schema({
  
  // name: {
  //   type: String,
  //   required: true,
  //   trim: true
  //     },
  // email: {
  //     type: String,
  //     required: true,
  //     unique: true,
  //     lowercase: true,
  //   },
  // password: {
  //   type: String,
  //   required: true,
  //   minLength: 7
  //   },
  // isVerified: {type: Boolean,default: false}
  username : String,
  password : String,
  email : String,
  image : {
    type : String,

    default : "https://www.shareicon.net/data/2016/07/05/791214_man_512x512.png",

  },
  isverified : {type : Boolean , default : false}

})

module.exports=mongoose.model("User",userSchema);