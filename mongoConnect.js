const mongoose = require('mongoose');

const dbConnectionString = process.env.MONGODB_URL_LOCAL

const connectDB = async()=>{
    
    mongoose.connect(dbConnectionString)
        .then(()=> console.log("Database Connection Successful"))
        .catch((error) => console.log("Connection Lost  : ",error));

}

module.exports = connectDB;
