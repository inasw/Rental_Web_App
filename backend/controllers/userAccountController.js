const User = require('../model/userModel')
const bcrypt = require('bcryptjs')
const asyncHandler = require("express-async-handler")

 const createUser = asyncHandler(async (req, res) => {
    try {
        const{role} = req.user

        if(role!=='admin' && role!=='superadmin'){
            res.status(403).json({error:'You are not autorized to create a user.'})
        }

        const user = await User.create(req.body);
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        // res.status(500).json({ error: 'Internal Server Error' }); 
        console.error(error)
    }
})

 const updateUser = asyncHandler(async (req, res) => {
    const {_id} = req.user
    const {id} =req.params
    
    try {

        const user = await User.findById(req.params.id)
        if (!user) {
            res.status(404).json({ message: 'User not found' });
       }

       if (req.user.role !== 'superadmin' && req.user.role !== 'admin' && _id.toString() !== id) {
        return res.status(403).json({ error: 'You do not have permission to update this account' });
       }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedUser) {
                 res.status(404).json({ message: 'User not found' });
            }else{
                res.status(200).json({message: 'User updated successfully',updatedUser});
            }
      }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
     }
  })

 const deleteUser = asyncHandler(async (req, res) => {
    const {role,_id}=req.user
    const {id}=req.params
    try{
        const user = await User.findById(req.params.id)
        if (!user) {
        res.status(404).json({ message: " User not found " })
        }

        if (req.user.role !== 'superadmin' && req.user.role !== 'admin') {
            res.status(403).json({ error: 'You do not have permission to delete accounts' });
        }

        if (_id.toString() === id) {
            return res.status(403).json({ error: 'You cannot delete your own account' });
        }

        if (user.role === "superadmin") {
        res.status(404)
        throw new Error("you can not delete super admin")
        }
        
        await User.findByIdAndRemove(id)
        res.status(200).json({ message: "User removed" })
    }
        catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
  })

  const deactivateUser = asyncHandler(async (req, res) => {

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).json({ message: "User Not Found!" });
    }

    await User.findByIdAndUpdate(user._id, { active: false });
  
    res.status(200).json({
      message: "User is deactivated successfully",
    });
  });

 const createAdmin = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body
    if (!name || !email || !password) {
      res.status(400).json({error:"Please add all fields"})
    }

    const salt = await bcrypt.genSalt(10)
     const hashedPassword =await bcrypt.hash(password,salt)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role,
    })
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      })
    } else {
      res.status(400).json({ error: 'Failed to create admin' })
    }
  })
  
  
  
  const logout = asyncHandler(async (req, res) => {
    res.cookie("accessToken", "", {
      expires: new Date(Date.now() + 1 * 1000),
      httpOnly: true,
    })
    res.cookie("refreshToken", "", {
      expires: new Date(Date.now() + 1 * 1000),
      httpOnly: true,
    })
    res.status(200).json({ message: "logout successfuly" })
  })
  
module.exports = {createUser,
    updateUser,
    deleteUser,
    createAdmin}
  