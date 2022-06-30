const mongoose = require('mongoose');

const peopleSchema = new mongoose.Schema({
    // 프로젝트 참여 횟수
    participation_time: {
        type: Number,
        required: true,
        default: 0
    },
    // 프로젝트 성공 횟수
    success_time: {
        type: Number,
        required: true,
        default: 0
    },
    // 총 보수
    total_pay: {
        type: Number,
        required: true,
        default: 0
    },
    // 출신 학교
    school: {
        type: String,
    },
    // 전공
    major: {
        type: String,
    },
    // 활동 지역
    activity_area: {
        type: String,
        required: true
    },
    // 자기 소개
    description: {
        type: String,
    },
    // 포트폴리오 
    portfolio: {
        type: String,
    },
    // My 프로젝트
    projects: {
        type: [mongoose.ObjectId],
    },
    // 계정
    userObjectId: {
        type: mongoose.ObjectId,
        required: true
    }
});

const People = mongoose.model('People', peopleSchema);

module.exports = People;