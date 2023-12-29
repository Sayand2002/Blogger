const userModel = require("../models/userModel")
const login = async(req, res)=>{
    try {
        res.render("login");
    } catch (error) {
        console.log(error);
    }
}

const verifyLogin = async(req, res)=>{
    try {
        const {username, password} = req.body;
        console.log(username, password);
    } catch (error) {
        console.log(error);
    }
}

const signup = async(req, res)=>{
    try {
        res.render("signup");
    } catch (error) {
        console.log(error);
    }
}

const addNewUser = async(req, res)=>{
    try {
        const{email, firstname, lastname, password} = req.body;
        console.log(req.body);
        res.render("settingProfile");
    } catch (error) {
        console.log(error);
    }
}



module.exports = {
    login,
    verifyLogin,
    signup,
    addNewUser,
}