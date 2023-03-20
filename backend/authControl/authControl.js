import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const tokenCreation = (id) => jwt.sign({ id }, process.env.JWTTOKENSECRET, { expiresIn: 3 * 24 * 60 * 60 });

const signupGet = (req, res) => {
    res.send('<h1>signup</h1>');
}
const loginGet = (req, res) => {
    res.send('<h1>login</h1>');
}
const signupPost = async (req, res) => {

    const { email, password } = req.body;
    const userCreation = await User.signUp(email, password);

    if (userCreation['errors']) res.status(404).json(userCreation['errors']);
    else {
        const token = tokenCreation(userCreation._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 })
            .status(200)
            .json(userCreation);
    }

}
const loginPost = async (req, res) => {
    const { email, password } = req.body;
    const userLogin = await User.login(email, password);
    if (userLogin['errors']) {
        res.status(404).json(userLogin['errors']);
    } else {
        const token = tokenCreation(userLogin._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 })
            .status(200)
            .json(userLogin);
    }
}
const logoutGet = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}
export {
    signupGet, loginGet, logoutGet,
    signupPost, loginPost
}