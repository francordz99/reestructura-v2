const mongoose = require('mongoose');

const userCollection = 'users';

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    email: { type: String, required: false },
    password: { type: String, required: false },
    role: { type: String, enum: ['admin', 'usuario'], default: 'usuario' },
});

const userModel = mongoose.model(userCollection, userSchema);

module.exports = userModel;