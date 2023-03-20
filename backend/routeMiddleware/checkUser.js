import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.js';

dotenv.config('../.env');

const checkUser = (req, res, next) => {
    const token = req.cookie.jwt;
    if (token) {
        jwt.verify(token, process.env.JWTTOKENSECRET,
            async (err, decodedId) => {
                if (err) {
                    res.locals.user = null;
                    next();
                } else {
                    const user = await User.findById({ _id: decodedId })
                    res.locals.user = user;
                    next();
                }
            });
    } else {
        res.locals.user = null;
        next();
    }
};

export default checkUser;