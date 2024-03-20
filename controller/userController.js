const userModel = require("../models/userModel");
const blogModel = require("../models/blogModel");
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require("path");
const mongoose = require("mongoose");

// Password encryption using bcrypt
async function hashPassword(password) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    } catch (error) {
        throw error;
    }
}

const login = async (req, res, next) => {
    try {
        res.render("login");
    } catch (error) {
        console.error(error);
        next(error);
    }
}

const guest = (req, res)=>{
  res.render("guest");
}

const verifyLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userData = await userModel.findOne({email: email});
        if(userData){
            const passwordMatch = await bcrypt.compare(password, userData.password);

            if(passwordMatch){

                req.session.email = email;
                const blogs = await blogModel.find();
                const user = await userModel.findOne({ email: req.session.email });
                res.render("home", { blogs: blogs, userId: user._id  });

            }else{
                res.json({message: "Invalid"});
            }
        }else{
            res.json({message: "Invalid"});
        }
    
    } catch (error) {
        console.error(error);
        next(error);
    }
};


const setProfile = async(req, res, next)=>{
    try {
        res.render("setProfileImg");
    } catch (error) {
        next(error);
    }
}

const addNewUser = async (req, res, next) => {
    try {
        const { txt, email, Pswd } = req.body;
        const hashedPassword = await hashPassword(Pswd);
        //check for user existance
        const userData = await userModel.findOne({email: email});
        if(userData){
            res.status(200).json({message: "exist"})
        }else{
            const newUser = new userModel({
                username: txt,
                email: email,
                password: hashedPassword 
            });
            await newUser.save();

            req.session.email = email;
        
            res.status(200).json({message: "success"})
        }
        
    } catch (error) {
        console.error(error);
        next(error);
    }
}

const profileImg = async (req, res, next) => {
    try {
        const email = req.session.email;
        const addImg = await userModel.updateOne({email: email},{$set:{image: req.file.filename}});
        if(addImg){
        res.status(200).json({message: "success"});
        }else{
        res.status(500).send({error: "failed"});
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}

const loadHome = async(req, res, next)=>{
    try {
        const blogs = await blogModel.find();
        const user = await userModel.findOne({ email: req.session.email });
        res.render("home", { blogs: blogs, userId: user._id  });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const loadProfile = async(req, res, next) => {
    try {
        const user = await userModel.findOne({ email: req.session.email });
        const blogs = await blogModel.find({ user: user._id });
        res.render("userProfile", {blogs: blogs, user: user, curUser: user._id});
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const editProfile = async(req, res, next) => {
    try {
        const user = await userModel.findOne({email: req.session.email});
        res.render("editProfileForm", {user: user});
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const editUserProfileData = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const image = req.file;
        const encryptPassword = await hashPassword(password);

        const user = await userModel.findOne({ email: req.session.email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.image) {
            const imagePath = path.resolve(__dirname, "..", 'public', 'uploads', user.image);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Blog image unlinked...");
                }
            });
        }

        if (username) {
            user.username = username;
        }
        if (password) {
            user.password = encryptPassword;
        }
        if (image) {
            user.image = image.filename;
        }

        const updatedData = await user.save();
        return res.status(200).json({ message: "success" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}


const loadAddBlog = async(req, res, next) => {
    try {
        res.render("addBlogForm");
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const addBlog = async(req, res, next) => {
    try {
        let { blogTitle, blogType, blogDescription } = req.body;
        let blogImg = req.file;
        let user = await userModel.findOne({email: req.session.email});
        if(user){
            const newBlog = new blogModel({
                title: blogTitle,
                description: blogDescription,
                blogType: blogType,
                postImg: blogImg.filename,
                user: user._id
            });

            let blogSaved = await newBlog.save();
            if(blogSaved){
                res.status(200).json({message: "success"});
            }else{
                res.status(501).json({message: "failed"});
            }
        }else{
            res.status(501).json({message: "failed"});
        }
       
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const deleteBlog = async(req, res, next) => {
    try {
        const blogId = req.params.blogId;
        const blog = await blogModel.findOne({ _id: blogId });
        const imagePath = path.resolve(__dirname, "..", 'public', 'uploads', blog.postImg);
        fs.unlink(imagePath,(err) => {
            if(err){
                console.log(err);
                next(err);
            }else{
                console.log("Blog image unlinked...");
            }
        })
        const deleteBlog = await blogModel.deleteOne({ _id: blogId });
        if(deleteBlog){
            res.json({message: "success"});
        }else{
            res.status(500).json({message: "failed"});
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const editBlog = async (req, res, next) => {
    try {
        const blog = await blogModel.findOne({_id: req.params.blogId});
        res.render("editBlog", {blogData: blog})
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const editBlogData = async (req, res, next) => {
    try {
        const { blogTitle, blogType, blogDescription, blogId } = req.body;
        const image = req.file;

        const blog = await blogModel.findById(blogId); 
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        let updatedImage = blog.postImg; 

        if (image) {
            const imagePath = path.resolve(__dirname, "../public/uploads", blog.postImg);
            fs.unlinkSync(imagePath); 
            updatedImage = image.filename; 
        }

        blog.title = blogTitle;
        blog.blogType = blogType;
        blog.description = blogDescription;
        blog.postImg = updatedImage;

        const updatedBlog = await blog.save();

        res.status(200).json({ message: "success"});
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const viewOtherUserProfile = async(req, res, next) => {
    try {
        const userId = req.params.userId;
        const curUser = await userModel.findOne({ email: req.session.email });
        const user = await userModel.findOne({ _id: userId });
        const blogs = await blogModel.find({ user: userId });
        res.render("userProfile", {blogs: blogs, user: user, curUser: curUser._id});
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const followUser = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const curUser = await userModel.findOne({ email: req.session.email });

        const addFollowToCurUser = await userModel.updateOne(
            { _id: curUser._id },
            { $push: { follows: userId } }
        );

        const addFollowingToUser = await userModel.updateOne(
            { _id: userId },
            { $push: { following: curUser._id } }
        );

        if (addFollowToCurUser && addFollowingToUser) {
            res.json({ message: "success" });
        } else {
            res.status(500).json({ message: "failed" });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const unFollowUser = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const curUser = await userModel.findOne({ email: req.session.email });

        const addFollowToCurUser = await userModel.updateOne(
            { _id: curUser._id },
            { $pull: { follows: userId } }
        );

        const addFollowingToUser = await userModel.updateOne(
            { _id: userId },
            { $pull: { following: curUser._id } }
        );

        if (addFollowToCurUser && addFollowingToUser) {
            res.json({ message: "success" });
        } else {
            res.status(500).json({ message: "failed" });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const likePost = async(req, res, next) =>{
    try {
        const { blogId, userId, isLiked } = req.body;
        let addLike = null;
        if(isLiked == "true"){
            addLike = await blogModel.updateOne({_id: blogId}, {$pull: {likes: userId}});
        }else{
            addLike = await blogModel.updateOne({_id: blogId}, {$push: {likes: userId}});
        }
        if (addLike) {
            res.json({message: "success"});
        } else {
            res.status(500).json({message: "failed"});
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const showComments = async(req, res, next) => {
    try {
        const user = await userModel.findOne({email: req.session.email});

        const blogId = req.params.blogId;
        const blog = await blogModel.findById(blogId)
        .populate({
            path: 'comments.user',
            model: 'userModel' 
        })
        .exec();
        if(blog){
            res.render("commentModal", {userId: user._id, blogId: blogId, commentData: blog.comments});
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const addComment = async(req, res, next) => {
    try {
        const { userId, blogId, comment } = req.body;
        
        const obj = {
            comment: comment,
            user: userId,
            commentedAt: new Date()
        }

        const updatedBlog = await blogModel.findByIdAndUpdate(
            blogId,
            { $push: { comments: obj } },
            { new: true } 
        ).populate({
            path: 'comments.user',
            model: 'userModel' 
        })
        .exec();

        if (updatedBlog) {
            res.render("commentModal", {userId: userId, blogId: blogId, commentData: updatedBlog.comments});
        }else{
            res.status(500).json({ message: "failed" })
        }

    } catch (error) {
        console.log(error);
        next(error);
    }
}

const deleteComment = async (req, res, next) => {
    try {
        const { commentId, blogId } = req.body;

        const user = await userModel.findOne({ email: req.session.email });

        const updatedBlog = await blogModel.findOneAndUpdate(
            { _id: blogId },
            { $pull: { comments: { _id: commentId } } },
            { new: true }
        ).populate({
            path: 'comments.user',
            model: 'userModel' 
        })
        .exec();

        
        if(updatedBlog){
            res.render("commentModal", {userId: user._id, blogId: blogId, commentData: updatedBlog.comments});
        }else{
            res.json({message: "failed"});
        }
        
    } catch (error) {
        console.log(error);
        next(error);
    }
};


const logout = (req, res, next) => {
    try {
        req.session.destroy();
        res.redirect("/user")
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = {
  guest,
  login,
  verifyLogin,
  addNewUser,
  setProfile,
  profileImg,
  loadHome,
  loadProfile,
  editProfile,
  editUserProfileData,
  loadAddBlog,
  addBlog,
  deleteBlog,
  editBlog,
  editBlogData,
  viewOtherUserProfile,
  followUser,
  unFollowUser,
  likePost,
  showComments,
  addComment,
  deleteComment,
  logout
};
