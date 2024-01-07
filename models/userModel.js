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
    status: {
        type: Boolean,
        require: true,
        default: 0
    },
    block: {
        type: Boolean,
        require: true,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const userModel = mongoose.model("userModel",User);

module.exports = userModel;