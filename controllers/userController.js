const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asynchandler = require("express-async-handler")
const User = require('../models/userModel') 


const userRoles = {
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Admin',
    LANDLORD: 'Landlord',
    BROKER: 'Broker',
    RENTER: 'Renter'
  };
  
  // Define permissions for each role
  const permissions = {
    SUPER_ADMIN: {
      createAccount: true,
      updateAccount: true,
      deleteAccount: true,
      blockUser: true,
      unblockUser: true,
      // Add more permissions as needed
    },
    ADMIN: {
      createAccount: true,
      updateAccount: true,
      deleteAccount: true,
      blockUser: true,
      unblockUser: true,
      // Add more permissions as needed
    },
    LANDLORD: {
      listProperties: true,
      editProperties: true,
      deleteProperties: true,
      manageRequests: true,
      // Add more permissions as needed
    },
    BROKER: {
      listProperties: true,
      manageRequests: true,
      // Add more permissions as needed
    },
    RENTER: {
      searchProperties: true,
      viewPropertyDetails: true,
      initiateRequest: true,
      manageProfile: true,
      viewHistory: true,
      // Add more permissions as needed
    }
  };
  
 
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

const forgetPassword = async(req,res) =>{
    try{
        const user = await User.findOne({email:req.body.email})
        if(!user){
            res.status(400).json('No account with this email found')
        }

        const resetToken =jwt.sign({id:user._id},
            process.env.JWT_SECRET ,
             {expiresIn:"1hr"},
        )
        res.json({message:"Reset token sent successfully",
        token:resetToken})

        
    }catch(error){
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const resetPassword = async(req,res)=>{
    try {
        const { token, newPassword } = req.body;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const id = decoded.id;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // hash the newpassword
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // Update password
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ error: 'Reset token has expired' });
        }
        // console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



module.exports={
    register,
    login,
    adminLogin,
    getProfile,
    updateProfile,
    deleteProfile,
    getAllUsers,
    getUserById,
    forgetPassword,
    resetPassword,

};