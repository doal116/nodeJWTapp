import express from 'express';
import * as authControl from '../authControl/authControl.js';

const router = express.Router();
router.use(express.json());

router.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html')
        .status(200)
        .send('<h1>Welcome to the home page.</h1>');
});

router.route('/login')
    .get(authControl.loginGet)
    .post(authControl.loginPost);

router.route('/signup')
    .get(authControl.signupGet)
    .post(authControl.signupPost);

export default router;