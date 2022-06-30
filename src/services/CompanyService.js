const Company = require('../models/Company');
const Email = require('../models/Email');
const User = require('../models/User');
const UserService = require('./UserService');

class CompanyService {
    async signUp(companyDTO) {
        const {
            companyName,
            // companyImage,
            industry,
            ceo,
            description,
            phoneNumber,
            url,
            address,
            email,
            password
        } = companyDTO;
        try {
            const user = await UserService.signUp({ email, password, category: "company" });
            const userObjectId = user._id;
            const company = new Company({
                companyName,
                // companyImage,
                industry,
                ceo,
                description,
                phoneNumber,
                url,
                address,
                userObjectId
            });
            await company.save();
        } catch (err) {
            console.log(err);
            throw '회원 가입에 문제가 생겼습니다. 다시 시도해주세요.';
        } 
    }

    async delete(userId) {
        try {
            const user = await User.findOne({ _id: userId });
            await Email.deleteOne({ email: user.email });
            await User.deleteOne({ _id: userId });
            await Company.deleteOne({ userObjectId: userId });
        } catch (err) {
            console.err(err);
            throw '회원 탈퇴에 문제가 생겼습니다. 다시 시도해주세요.';
        }
    }

    async getCompanyList() {
        try {
            return await Company.find({});
        } catch (err) {
            console.log(err);
            throw '회사 목록을 조회하는데 오류가 발생했습니다. 다시 시도해주세요.';
        }
    }
}

module.exports = new CompanyService();