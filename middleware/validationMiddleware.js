const roleMiddleware = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Access denied. You do not have permission to perform this action.' });
        }
        next();
    };
};

module.exports = roleMiddleware;
