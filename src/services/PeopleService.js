const User = require('../models/User');
const People = require('../models/People');
const Email = require('../models/Email');
const UserService = require('./UserService');

class PeopleService {
    async signUp(peopleDTO) {
        const {
            school,
            major,
            activity_area,
            description,
            portfolio,
            email,
            password
        } = peopleDTO;
        try {
            const user = await UserService.signUp({ email, password, category: "people" });
            const userObjectId = user._id;
            const people = new People({
                school,
                major,
                activity_area,
                description,
                portfolio,
                userObjectId
            });
            await people.save();
        } catch (err) {
            console.log(err);
            throw err;
        } 
    }

    async delete(userId) {
        try {
            const user = await User.findOne({ _id: userId });
            await Email.deleteOne({ email: user.email });
            await User.deleteOne({ _id: userId });
            await People.deleteOne({ userObjectId: userId });
        } catch (err) {
            console.err(err);
            throw '회원 탈퇴에 문제가 생겼습니다. 다시 시도해주세요.';
        }
    }

    async getPeopleList() {
        try {
            return await People.find({});
        } catch (err) {
            console.log(err);
            throw '피플 목록을 조회하는데 오류가 발생했습니다. 다시 시도해주세요.';
        }
    }
}

module.exports = new PeopleService();