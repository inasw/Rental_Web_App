const express = require("express");
const router = express.Router();
const {protect,restrict} =require('../middleware/authMiddleware')
const {userValidator} = require('../middleware/userValidator')
const {
    register,
    login,
    adminLogin,
    getProfile,
    updateProfile,
    deleteProfile,
    getAllUsers,
    getUserById,
    resetPasswordRequestController,
    resetPasswordController}= require('../controllers/UserController');

const {createUser,
       updateUser,
       deleteUser,
       createAdmin} = require('../controllers/userAccountController')


router.post('/signup',userValidator,register);
router.post('/login',login);
router.post('/adminLogin',adminLogin);

router.get('/getProfile',protect,getProfile);
router.get('/getbyid/:id',protect,getUserById);
router.put('/updateProfile/:id', protect, updateProfile);
router.delete('/deleteProfile/:id', protect,deleteProfile);

router.put('/resetPasswordRequest', resetPasswordRequestController,);
router.put('/resetPassword', resetPasswordController,);

//admin and superadmin can access all users data 
router.get('/getAllUsers',protect,restrict('admin','superadmin'),getAllUsers);
router.post('/createAdmin',protect,restrict( 'superadmin'), createAdmin)
router.put('/updateUser/:id',protect,restrict('superadmin','admin'), updateUser)
router.delete('/deleteUser/:id',protect,restrict( 'superadmin','admin'), deleteUser)
router.post('/createUser',protect,restrict( 'superadmin','admin'), createUser)
      
                  
     
module.exports = router;