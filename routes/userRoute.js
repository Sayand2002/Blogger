const express = require("express");
const userRoute  = express();
const path = require("path");

userRoute.set("view engine", "ejs");
userRoute.set("views", path.join(__dirname, "../views/user"));

const userController = require("../controller/userController");

userRoute.get("/user", userController.login);
userRoute.post("/user/login", userController.verifyLogin);
userRoute.get("/user/signup", userController.signup);
userRoute.post("/user/signup", userController.addNewUser)

module.exports = userRoute;