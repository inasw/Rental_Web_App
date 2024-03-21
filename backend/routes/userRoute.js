const express = require("express");
const router = express.Router();
const {protect,restrict} =require('../middleware/authMiddleware')
const {userValidator} = require('../middleware/userValidator')
const {
    register,
    login,
    getProfile,
    updateProfile,
    deleteProfile,
    getAllUsers,
    resetPasswordRequestController,
    resetPasswordController}= require('../controllers/UserController');


router.post('/signup',userValidator,register);
router.post('/login',login);
router.get('/getProfile',protect,restrict('admin','superadmin','tenant'),getProfile);
router.put('/updateProfile/:id', protect,restrict('admin','superadmin','tenant'), updateProfile);
router.delete('/deleteProfile/:id', protect,restrict('admin','superadmin','tenant'), deleteProfile);

router.put('/resetPasswordRequest', resetPasswordRequestController,);
router.put('/resetPassword', resetPasswordController,);

//admin can access all users data 
router.get('/getAllUsers',protect,restrict('admin','superadmin'),getAllUsers);
module.exports = router;