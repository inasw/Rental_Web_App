const User = require('../models/userModel');

const verifyUser = async (req, res) => {
  try {
    const { userId } = req.params;
    // Extract role from query parameters and convert to lowercase
    const role = req.query.role ? req.query.role.trim().toLowerCase() : undefined;

   

    // Validate the role parameter
    if (!role || !['landlord', 'broker', 'tenant'].includes(role)) {
      return res.status(400).json({ error: 'Invalid or missing role specified' });
    }
 
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

   

    // Ensure the user has the specified role
    if (user.role.toLowerCase() !== role) {
      return res.status(400).json({ error: 'User role does not match the specified role for verification' });
    }

    // Perform verification logic here (e.g., update user's status to verified)
    user.verified = true;
    await user.save();

    res.json({ message: `${role} verified successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { verifyUser };