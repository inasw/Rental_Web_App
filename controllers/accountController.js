const User = require('../models/userModel');
const { permissions, userRoles } = require('../middleware/permissionMiddleware');

// Function to create user accounts
const createUserAccount = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== userRoles.SUPER_ADMIN && role !== userRoles.ADMIN) {
      return res.status(403).json({ error: 'You do not have permission to create accounts' });
    }

    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to update user accounts
const updateUserAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, _id } = req.user;

    const userToUpdate = await User.findById(id);

    if (!userToUpdate) {
      return res.status(404).json({ error: 'User not found' });
    }

    if ((role === userRoles.LANDLORD || role === userRoles.BROKER) && _id.toString() !== id) {
      return res.status(403).json({ error: 'You do not have permission to update this account' });
    }

    // Update user information
    Object.assign(userToUpdate, req.body);
    await userToUpdate.save();

    res.json({ message: 'User updated successfully', user: userToUpdate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to delete user accounts
const deleteUserAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, _id } = req.user;

    if (role !== userRoles.SUPER_ADMIN && role !== userRoles.ADMIN) {
      return res.status(403).json({ error: 'You do not have permission to delete accounts' });
    }

    if (role === userRoles.LANDLORD || role === userRoles.BROKER) {
      return res.status(403).json({ error: 'Landlords and Brokers cannot delete user accounts' });
    }

    if (_id.toString() === id) {
      return res.status(403).json({ error: 'You cannot delete your own account' });
    }

    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to block a user account
const blockUserAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;

    if (role !== userRoles.SUPER_ADMIN && role !== userRoles.ADMIN) {
      return res.status(403).json({ error: 'You do not have permission to block user accounts' });
    }

    const userToBlock = await User.findById(id);

    if (!userToBlock) {
      return res.status(404).json({ error: 'User not found' });
    }

    userToBlock.blocked = true;
    await userToBlock.save();

    res.json({ message: 'User blocked successfully', user: userToBlock });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to unblock a user account
const unblockUserAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;

    if (role !== userRoles.SUPER_ADMIN && role !== userRoles.ADMIN) {
      return res.status(403).json({ error: 'You do not have permission to unblock user accounts' });
    }

    const userToUnblock = await User.findById(id);

    if (!userToUnblock) {
      return res.status(404).json({ error: 'User not found' });
    }

    userToUnblock.blocked = false;
    await userToUnblock.save();

    res.json({ message: 'User unblocked successfully', user: userToUnblock });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createUserAccount,
  updateUserAccount,
  deleteUserAccount,
  blockUserAccount,
  unblockUserAccount
};
