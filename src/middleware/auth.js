const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const auth = async (req, res, next) => {
    res.locals.user = null;
    const token = req.cookies.jwt;
    if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        try {
            const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
            if (user) {
                res.locals.user = user;
            }
        } catch (e) {
            res.status(400).send()
        }
    };
    next()
}



const checkUser = async (req, res, next) => {
    const token = req.cookies.jwt;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        if (!user) {
            throw new Error()
        }
        req.user = user;
        req.token = token;
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}



module.exports = { auth, checkUser }