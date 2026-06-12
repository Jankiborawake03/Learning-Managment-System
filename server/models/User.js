const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userName : String,
    userEmail : String,
    password : String,
    role:String,
    access: {
        type: Boolean,
        default: false // Set default value to false
    },
});

module.exports = mongoose.model("User",UserSchema);