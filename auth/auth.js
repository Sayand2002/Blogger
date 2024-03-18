const authMiddleware = (req, res, next) => {
    if (req.session && req.session.email) {
        next();
    } else {
        res.redirect('/user'); 
    }
};

module.exports = authMiddleware;