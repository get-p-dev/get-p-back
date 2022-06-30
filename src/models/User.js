const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, '이메일은 필수로 기입해야 합니다.'],
        match: [/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, '올바른 이메일 형식을 입력하세요.'],
        trime: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, '비밀번호는 필수로 기입해야 합니다.'],
        trim: true,
        select: false
    },
    salt: {
        type: String,
        required: true,
        select: false
    },
    verify: {
        type: Boolean,
        required: true,
        select: false
    },
    category: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;