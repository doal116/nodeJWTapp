import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config('../.env');

const requireAuth = (req, res, next) => {
    const token = req.cookie.jwt;
    if (token) {
        jwt.verify(token, process.env.JWTTOKENSECRET,
            (err, decoded) => {
                if (err) {
                    console.log(err.message);
                    res.redirect('/login')
                } else {
                    console.log(decoded);
                    next();
                }
            });
    } else {
        res.redirect('/login');
    }
};

export default requireAuth;