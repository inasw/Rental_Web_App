const express = require("express");
const router = express.Router();
const {protect, permittedTo} =require('../middleware/authMiddleware');
const {userValidator} = require('../middleware/userValidator');
const {
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
       createUser,
       updateUser,
       deleteUser,
       createAdmin
     } = require('../controllers/userController'); 
     
     
     // Define routes for user functionalities
router.get('/api/users', getAllUsers);
router.post('/api/users/register', register);
router.post('/api/users/login', login);
router.post('/api/users/adminLogin', adminLogin);
router.get('/api/users/profile', getProfile);
router.put('/api/users/profile/:id', updateProfile);
router.delete('/api/users/profile/:id', deleteProfile);
router.get('/api/users/:id', getUserById);
router.post('/api/users/forget-password', forgetPassword);
router.post('/api/users/reset-password', resetPassword);

// routing for Role based acesses 
router.post('/signup',userValidator,register);
router.post('/login',login);
router.post('/adminLogin',adminLogin); 
// 
router.get('/getProfile',protect,getProfile);
router.get('/getbyid/:id',protect,getUserById);
router.put('/updateProfile/:id', protect, updateProfile);
router.delete('/deleteProfile/:id', protect,deleteProfile);

router.post('/forgetPassword', forgetPassword); 
router.post('/resetPassword', resetPassword);

//admin and superadmin can access all users data 
router.get('/getAllUsers',protect,permittedTo('admin','superadmin'),getAllUsers);
router.post('/createAdmin',protect,permittedTo( 'superadmin'), createAdmin)
router.put('/updateUser/:id',protect,permittedTo('superadmin','admin'), updateUser)
router.delete('/deleteUser/:id',protect,permittedTo( 'superadmin','admin'), deleteUser)
router.post('/createUser',protect,permittedTo( 'superadmin','admin'), createUser)
      
                  
     
module.exports = router;