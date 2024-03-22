const User = require('../models/userModel');

// Function to create a new user account
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if the current user is authorized as Super Admin
        if (req.user && req.user.role === "SuperAdmin") {
            const user = new User({ name, email, password, role });
            await user.save();
            res.status(201).json({ message: 'User created successfully' });
        } else {
            res.status(403).json({ message: 'Not authorized to create user account' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create user account' });
    }
};

// Function to update user information
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userData = req.body;

        // Check if the current user is authorized as Super Admin
        if (req.user && req.user.role === "SuperAdmin") {
            const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(updatedUser);
        } else {
            res.status(403).json({ message: 'Not authorized to update user information' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update user information' });
    }
};

// Function to delete a user account
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the current user is authorized as Super Admin
        if (req.user && req.user.role === "SuperAdmin") {
            const deletedUser = await User.findByIdAndDelete(id);
            if (!deletedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(403).json({ message: 'Not authorized to delete user account' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete user account' });
    }
};

// Function to block a user
exports.blockUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the current user is authorized as Super Admin
        if (req.user && req.user.role === "SuperAdmin") {
            const blockedUser = await User.findByIdAndUpdate(id, { blocked: true }, { new: true });
            if (!blockedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'User blocked successfully' });
        } else {
            res.status(403).json({ message: 'Not authorized to block user' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to block user' });
    }
};

// Function to unblock a user
exports.unblockUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the current user is authorized as Super Admin
        if (req.user && req.user.role === "SuperAdmin") {
            const unblockedUser = await User.findByIdAndUpdate(id, { blocked: false }, { new: true });
            if (!unblockedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'User unblocked successfully' });
        } else {
            res.status(403).json({ message: 'Not authorized to unblock user' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to unblock user' });
    }
};