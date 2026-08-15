import fs from "fs"
import multer from "multer"

const uploadPath = "../uploads";

if(!fs.existsSync(uploadPath)){
    fs.mkdirSync()
}

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,uploadPath)
    },
    filename : (req,file,cb)=>{
        cb(null,file.originalname);
    }
})

const fileFilter = (req,file,cb)=>{
    if(file.mimetype == 'application/pdf'){
        cb(null, true);
    }else{
        cb(new Error("Only pdf files are allowed."),false);
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits:{
        fileSize : 20*1024*1024
    }
})