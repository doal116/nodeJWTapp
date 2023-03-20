import User from '../models/user.js'

const signupGet = (req, res) => {
    res.send('<h1>signup</h1>');
}
const loginGet = (req, res) => {

}
const signupPost = async (req, res) => {
    const { email, password } = req.body;
    const userCreation = await User.signUp(email, password);
    if (userCreation['errors']) {
        res.status(404).json(userCreation['errors']);
    } else res.status(200).json(userCreation);

}
const loginPost = async (req, res) => {
    const { email, password } = req.body;
    const userLogin = await User.login(email, password);
    if (userLogin['errors']) {
        res.status(404).json(userLogin['errors']);
    } else res.status(200).json(userLogin);
}

export {
    signupGet, loginGet,
    signupPost, loginPost
}