const mongoose = require("mongoose");

const User = mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    image: {
        type: String,
    },
    follows: {
        type: [ String ]
    },
    following:{
        type: [ String ] 
    },
}, { timestamps: true });

const userModel = mongoose.model("userModel",User);

module.exports = userModel;