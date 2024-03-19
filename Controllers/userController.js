const User = require('../models/User');
// const User = require('../models/User');


exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting the user' });
    }
};

exports.blockUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        user.blocked = true;
        await user.save();
        res.json({ message: 'User blocked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while blocking the user' });
    }
};

exports.unblockUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        user.blocked = false;
        await user.save();
        res.json({ message: 'User unblocked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while unblocking the user' });
    }
};
exports.updateProfile = async (req, res) => {
    try {
        const { id } = req.user;
        const { name, email, contactDetails } = req.body;
        const user = await User.findById(id);
        user.name = name;
        user.email = email;
        user.contactDetails = contactDetails;
        await user.save();
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating the profile' });
    }
};
