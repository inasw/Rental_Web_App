const jwt = require('jsonwebtoken')
const asynchandler = require('express-async-handler')
const User = require('../model/userModel')

const protect = asynchandler(async(req,res,next)=>{
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        try{
            token=req.headers.authorization.split(' ')[1]
            const decode = jwt.verify(token,process.env.JWT_SECRET)
                //if valid token
            req.user =await User.findById(decode.id).select('-password') 

            next();
    }catch (error){
        res.status(401).json({error:"Not authorized"})
    }
}
    if(!token){
        res.status(401).json({error:"Token not found"})
    }
})

const restrict = (...role)=>{
    return(req,res,next)=>{
        if(!role.includes(req.user.role)){
            res.status(403).json({message:"You do not have permission to perform this action"})
        }
        next();
    }
}


module.exports = {protect,restrict};