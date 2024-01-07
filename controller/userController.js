const userModel = require("../models/userModel");
const bcrypt = require('bcrypt');

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

const verifyLogin = async (req, res, next) => {
  try {
    const { email, Pswd } = req.body;
    console.log(email, Pswd);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

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
  
      req.session.userEmail = email;
  
      res.status(200).json({message: "success"})
    }
    
  } catch (error) {
    console.error(error);
    next(error);
  }
}

const profileImg = async (req, res, next) => {
  try {
    console.log(req.file.filename);
    const email = req.session.userEmail;
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

module.exports = {
  login,
  verifyLogin,
  addNewUser,
  setProfile,
  profileImg
};
