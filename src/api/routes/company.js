// Module
const express = require('express');
const router = express.Router();
const passport = require('passport');
const CompanyService = require('../../services/CompanyService');

// 전체 회사 목록 조회
router.get('/', async (req, res) => {
    try {
        const companyList = await CompanyService.getCompanyList();
        console.log(`[GET] /company`);
        res.status(200).json(companyList);
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

// 회사 회원 가입
router.post('/', async (req, res) => {
    try {
        await CompanyService.signUp(req.body);
        console.log(`[POST] /company ${req.body.email}`);
        res.status(200).json({ message: '회원 가입이 완료되었습니다.' });
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

// 회사 회원 탈퇴
router.delete('/:userId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (req.params.userId === req.user._id.toString()) {
            await CompanyService.delete(req.user._id);
            console.log(`[DELETE] /company ${req.user.email}`);
            res.status(200).send();
        } else {
            res.status(403).json({ message: '허가되지 않은 접근입니다.' });
        }
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

module.exports = router;