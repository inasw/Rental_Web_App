const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asynchandler = require("express-async-handler")
const User = require('../model/userModel')
const {requestPasswordReset,resetPassword} = require('../service/authResetPassword')
 
//   Register
const register = async(req,res)=>{
try{
    const {name,email,password,username,mainAddress,phoneNumber,role,commissionRate} = req.body;

    // if(role == 'admin' || role == 'superadmin'){
    //     res.status(400).json({error:"You can't register as admin or superadmin"})
    // }

    if(!name || !email || !password ||! username|| !mainAddress||!phoneNumber){
        res.status(400).json({error:"Please fill all fields"});
     } 

     const userExists = await User.findOne({email})
     if(userExists){
        res.status(400).json({error:"User already exists"})
     }

    //  if (role === 'broker' && commissionRate === undefined) {
    //     return res.status(400).json({ error: "Commission rate is required for brokers" });
    // }

        // create user and hash password
     const salt = await bcrypt.genSalt(10)
     const hashedPassword =await bcrypt.hash(password,salt)

     let user;
    //  if(role === 'broker'){
    
    //     user = await User.create({
    //        name,
    //        email,
    //        password:hashedPassword,
    //        username,
    //        mainAddress,
    //        phoneNumber, 
    //        role,
    //        broker: {
    //         commissionRate
    //         }
    //     }) 
    //  } else{
        user = await User.create({
            name,
            email,
            password:hashedPassword,
            username,
            mainAddress,
            phoneNumber, 
            role,
     })
    // }

     if(user){
        res.status(201).json({
            _id : user.id,
            name:user.name,
            username:user.username,
            email:user.email,
            phone:user.phoneNumber,
            address:user.mainAddress,
            token:generateToken(user._id),
        })

    }else
     {
        res.status(400).json({message:"User not created"})
     }
    } catch (error) {
        console.error(error);
        // res.status(500).json({ error: "Internal Server Error" });
    }
    };


    // getProfile
    const getProfile = asynchandler(async(req,res)=>{
        try {
            res.json(req.user); 
          } catch (error) {
            res.status(400).json({ 
              message: 'Profile not found'
            });
          }   
    })

    // getProfilebyId
    const getUserById = asynchandler(async (req, res) => {
        const user = await User.findById(req.params.id).select("-password")
        if (user) {
          res.status(200).json(user)
        } else {
          res.status(404).json({error: 'User not found'})
        }
      })

        // getAllUser
    const getAllUsers =  asynchandler(async (req, res) =>{
       try { const users = await User.find()
        res.status(200).json(users);
        }  catch (err) {
            res.status(500).json({error:'Internal server error'})
        }
    })

    // updateProfile
    const updateProfile = asynchandler(async(req,res)=>{
        const user = await User.findById(req.user.id)
        if(!user){
            res.status(401).json({error:"user not found"})
        }
        try {
            const updatedProfile = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!user) {
                 res.status(404).json({ message: 'User not found' });
            }else{
                res.status(200).json({message:'User updated successfully',updatedProfile});
            }
        
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })

    // deleteProfile
    const deleteProfile = asynchandler(async(req,res)=>{
        const {role,_id}= req.user
        const {id}= req.params

        try {
            if (role === 'admin' && _id.toString() === id) {
                res.status(403).json({ error: 'You cannot delete your own account' });
                return;
              }
            const user = await User.findById(req.params.id);
            if (!user) {
                 res.status(404).json({ message: 'User not found' });
            }
           
            if (user.role === 'superadmin') {
                res.status(403).json({ error: 'You cannot delete a superadmin account' });
            }

            const deletedProfile = await User.findByIdAndRemove(req.params.id)
            res.json({ message: 'User deleted successfully' });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    })

    // Login
const login = async(req,res)=>{
    const{username,password}= req.body

    const user = await User.findOne({username})
    if(user && (await bcrypt.compare(password,user.password))){
        res.json({
            _id:user.id,
            name:user.name,
            username:user.username,
            email:user.email,
            token: generateToken(user._id)
        })
    }else{
        res.status(401).json({error:'Invalid username or password'})
    }
    }

const adminLogin = async(req,res)=>{
    const{email,password}= req.body

    const user = await User.findOne({email})
    if(user && (await bcrypt.compare(password,user.password))){
        res.json({
            _id:user.id,
            name:user.name,
            email:user.email,
            token: generateToken(user._id)
        })
    }else{
        res.status(401).json({error:'Invalid email or password'})
    }
    }

const generateToken = (id) =>{
    return jwt.sign({id},
            process.env.JWT_SECRET ,
             {expiresIn:"10d"},
        )
}

const resetPasswordRequestController = async (req, res, next) => {
    const requestPasswordResetService = await requestPasswordReset(
      req.body.email
    );
    return res.json(requestPasswordResetService);
  };
  
  const resetPasswordController = async (req, res, next) => {
    const resetPasswordService = await resetPassword(
      req.body.id,
      req.body.token,
      req.body.password
    );
    return res.json(resetPasswordService);
  };

module.exports={
    register,
    login,
    adminLogin,
    getProfile,
    updateProfile,
    deleteProfile,
    getAllUsers,
    getUserById,
    resetPasswordRequestController,
    resetPasswordController};