const passport = require("passport");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackUrl: "/auth/google/callback",
            scope: ["profile", "email"],
        },
        function (accessTokens, refreshTokens, profile, callback){
            callback(null, profile);
        }
    )
)

passport.serializeUser((user, done)=>{
    done(null, user);
});

passport.deserializeUser((user, done)=>{
    done(null, user);
});