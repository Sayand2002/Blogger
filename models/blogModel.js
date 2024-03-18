const mongoose = require("mongoose");

const Blog = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    blogType:{
        type: String
    },
    postImg: {
        type: String,
        require: true
    },
    likes: {
        type: [ String ],
    },
    comments: {
        type: [ 
            {
                text: {
                    type: String,
                },
                commentedAt: {
                    type: Date,
                }
            }
         ]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel'  
    }
}, { timestamps: true });

const blogModel = mongoose.model("blogModel",Blog);

module.exports = blogModel;