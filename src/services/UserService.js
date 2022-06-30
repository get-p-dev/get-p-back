const crypto = require('crypto');
const User = require('../models/User');
const EmailService = require('./EmailService');

class UserService {
    isValidEmail(email) {
        const emailReg = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (emailReg.test(email)) {
            return true;
        } else {
            return false;
        }
    }

    isValidPassword(password) {
        const passReg = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
        if (passReg.test(password)) {
            return true;
        } else {
            return false;
        }
    }

    async signUp(userDTO) {
        const { email, password, category } = userDTO;
        switch (true) {
            case !this.isValidEmail(email):
                throw '올바른 이메일을 입력해주세요.';
            case !this.isValidPassword(password):
                throw '올바른 비밀번호를 입력해주세요.';
            default:
                try {
                    const user = await User.findOne({ email });
                    if (user) throw '이미 가입된 이메일 입니다. 다른 이메일을 입력해주세요.';
                    return await this.generateUser(email, password, category);
                } catch (err) {
                    console.log(err);
                    throw '회원 가입에 문제가 생겼습니다. 다시 시도해주세요.';
                }
        }
    }

    async generateUser(email, password, category) {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(64, (err, buf) => {
                if (err) throw err;
                crypto.pbkdf2(password, buf.toString('base64'), 100000, 64, 'sha512', async (err, key) => {
                    if (err) throw err;
                    const user = new User({
                        email,
                        password: key.toString('base64'),
                        salt: buf.toString('base64'),
                        category,
                        verify: false
                    });
                    await user.save();
                    EmailService.sendVerifyEmail(email);
                    resolve(user);
                });
            });
        });
    }

    async authorize(email, password, salt) {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, 100000, 64, 'sha512', async (err, key) => {
                if (err) throw err;
                const user = await User.findOne({
                    email,
                    password: key.toString('base64')
                });
                if (user) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    async delete(userId) {
        try {
            await User.deleteOne({ _id: userId });
        } catch (err) {
            console.err(err);
            throw '회원 탈퇴에 문제가 생겼습니다. 다시 시도해주세요.';
        }
    }

    async getUserList() {
        try {
            return await User.find({});
        } catch (err) {
            console.err(err);
            throw '사용자 목록을 조회하는데 오류가 발생했습니다. 다시 시도해주세요.';
        }
    }
}

module.exports = new UserService();