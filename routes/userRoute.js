const express = require("express");
const userRoute  = express();
const path = require("path");
const multer  = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  const upload = multer({ storage: storage })


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