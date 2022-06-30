// Module
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Services
const UserService = require('../../services/UserService');
const EmailService = require('../../services/EmailService');
const { JWT_SECRET } = require('../../config');

// 전체 사용자 목록 조회
router.get('/', async (req, res) => {
    try {
        const userList = await UserService.getUserList();
        console.log(`[GET] /users`);
        res.status(200).json(userList);
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

// Verify email
router.get('/verify', async (req, res) => {
    const emailDTO = req.query;
    try {
        await EmailService.verifyEmail(emailDTO);
        console.log(`[GET] /users/verify ${emailDTO.email}`);
        res.status(200).send();
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

// 로그인
router.post('/signin', async (req, res, next) => {
    try {
        passport.authenticate('local', (authError, user, info) => {
            if (authError || !user) {
                res.status(400).json({ message: info.reason })
                return;
            }
            req.login(user, { session: false }, (loginError) => {
                if (loginError) {
                    res.send(loginError);
                    return;
                }
                const token = jwt.sign({ _id: user._id, email: user.email, category: user.category }, JWT_SECRET);
                res.status(200).json({ token });
            });
        })(req, res);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;