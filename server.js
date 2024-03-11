const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'your_secret_key';

// Middleware
app.use(bodyParser.json());

// Dummy database
let users = [];

// Authentication Middleware
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

// Routes
// Sign Up
app.post('/api/signup', (req, res) => {
    const { name, email, password, phone, role } = req.body;
    const newUser = { id: users.length + 1, name, email, password, phone, role };
    users.push(newUser);
    const token = jwt.sign({ user: newUser }, JWT_SECRET);
    res.json({ token, message: 'User signed up successfully.' });
});

// Login
// app.post('/api/login', (req, res) => {
//     const { email, password } = req.body;
//     const user = users.find(user => user.email === email && user.password === password);
//     if (!user) {
//         return res.status(401).json({ message: 'Invalid email or password' });
//     }
//     const token = jwt.sign({ user }, JWT_SECRET);
//     res.json({ token, message: 'Login successful' });
// });

// Protected Route (Requires Authentication)
app.get('/api/protected', authenticateUser, (req, res) => {
    res.json({ message: 'Protected route accessed successfully', user: req.user });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
