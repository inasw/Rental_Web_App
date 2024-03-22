const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['SuperAdmin', 'Admin', 'Landlord', 'Broker', 'Renter'],
        default: 'Renter'
    },
    contact: {
        type: Number, // Change type to Number for integer values
        required: true
    },
    blocked: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
