require("dotenv/config");
const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session")
const connectDB = require("./mongoConnect");
connectDB()

app.use('/public', express.static(path.join(__dirname, '/public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: true ,
    cookie: {
        maxAge: null,
    }
}));

const userRoute = require("./routes/userRoute");

app.use("/", userRoute);

const port = process.env.PORT || 2000;

app.listen(port, () => {
    console.log(`Server running @ http://localhost:${port}`);
});
