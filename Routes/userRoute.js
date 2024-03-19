const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.put('/:id/block', userController.blockUser);
router.put('/:id/unblock', userController.unblockUser);
router.get('/', userController.searchUsers);

module.exports = router;
