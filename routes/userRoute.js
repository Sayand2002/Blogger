const express = require("express");
const userRoute = express();
const path = require("path");

userRoute.set("view engine", "ejs");
userRoute.set("views", path.join(__dirname, "../views/user"));

const userController = require("../controller/userController");
const upload = require('../multerConfig'); 

const authMiddleware = require("../auth/auth")

userRoute.get("/",userController.guest);

userRoute.get("/user/home", authMiddleware, userController.loadHome);
userRoute.get("/user/profile", authMiddleware, userController.loadProfile);
userRoute.get("/user/editProfile", authMiddleware, userController.editProfile);
userRoute.get("/user/loadAddBlog", authMiddleware, userController.loadAddBlog);
userRoute.get("/user/logout", authMiddleware, userController.logout);

userRoute.get("/", userController.guest);
userRoute.get("/user", userController.login);
userRoute.post("/user/login", userController.verifyLogin);
userRoute.post("/user/signup", userController.addNewUser);
userRoute.get("/user/setProfile", userController.setProfile);
userRoute.post("/user/profileImg", upload.single("User-Img"), userController.profileImg);
userRoute.post("/user/addBlog", upload.single("blogImage"), userController.addBlog);
userRoute.delete("/user/deleteBlog/:blogId", userController.deleteBlog);
userRoute.get("/user/viewOtherUserProfile/:userId",authMiddleware, userController.viewOtherUserProfile);
userRoute.patch("/user/followUser",authMiddleware, userController.followUser);
userRoute.patch("/user/unFollowUser",authMiddleware, userController.unFollowUser);
userRoute.patch("/user/likePost",authMiddleware, userController.likePost);

userRoute.patch('/user/addComment', authMiddleware, userController.addComment);
userRoute.get('/user/showComments/:blogId', authMiddleware, userController.showComments);
userRoute.patch("/user/deleteComment",authMiddleware, userController.deleteComment);
userRoute.patch("/user/editProfile",authMiddleware, upload.single("newProfileImg"), userController.editUserProfileData);
userRoute.get("/user/editBlog/:blogId", authMiddleware, userController.editBlog);
userRoute.patch("/user/editBlog", upload.single("blogImage"), userController.editBlogData);
userRoute.get("/user/filterBlog/:type", userController.filterBlog);


 




userRoute.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

module.exports = userRoute;
