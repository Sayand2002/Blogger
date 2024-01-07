const express = require("express");
const userRoute  = express();
const path = require("path");
const multer  = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
      const name = Date.now() + "-" + file.originalname;
      cb(null, name);
  },
});
const upload = multer({ storage: storage });


userRoute.set("view engine", "ejs");
userRoute.set("views", path.join(__dirname, "../views/user"));

const userController = require("../controller/userController");

userRoute.get("/user", userController.login);
userRoute.post("/user/login", userController.verifyLogin);
userRoute.post("/user/signup", userController.addNewUser);
userRoute.get("/user/setProfile", userController.setProfile);
userRoute.post("/user/profileImg", upload.single("User-Img"), userController.profileImg);

userRoute.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});


module.exports = userRoute;