const express = require('express');
const router = express.Router();
const multer = require('multer')

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


router.post('/uploadFile',upload.single('image'),(req,res)=>{
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

module.exports = router