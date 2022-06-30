// Module
const express = require('express');
const router = express.Router();
const passport = require('passport');
const PeopleService = require('../../services/PeopleService');

// 피플 목록 조회
router.get('/', async (req, res) => {
    try {
        const peopleList = await PeopleService.getPeopleList();
        console.log(`[GET] /people`);
        res.status(200).json(peopleList);
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

// 피플 회원 가입
router.post('/', async (req, res) => {
    try {
        await PeopleService.signUp(req.body);
        console.log(`[POST] /people ${req.body.email}`);
        res.status(200).json({ message: '회원 가입이 완료되었습니다.' });
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

// 피플 회원 탈퇴
router.delete('/:userId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (req.params.userId === req.user._id.toString()) {
            await PeopleService.delete(req.user._id);
            console.log(`[DELETE] /people ${req.user.email}`);
            res.status(200).send();
        } else {
            res.status(403).json({ message: '허가되지 않은 접근입니다.' });
        }
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

module.exports = router;