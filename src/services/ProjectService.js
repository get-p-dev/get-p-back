const Project = require('../models/Project');
const Proposal = require('../models/Proposal');

class ProjectService {
    async createProject(projectDTO) {
        try {
            const project = new Project(projectDTO);
            await project.save();
        } catch (err) {
            console.error(err);
            throw '프로젝트 생성에 문제가 생겼습니다. 다시 시도해주세요.';
        }
    }

    async readProject(projectId) {
        try {
            return await Project.findOne({ _id: projectId });
        } catch (err) {
            console.error(err);
            throw '프로젝트 조회에 문제가 생겼습니다. 다시 시도해주세요.';
        }
    }

    async updateProject(userId, projectId, projectDTO) {
        try {
            const project = await Project.findOne({ _id: projectId });
            if (userId.toString() == project.requester.toString()) {
                await Project.findByIdAndUpdate(projectId, projectDTO);
            } else {
                throw '허가되지 않은 접근입니다.';
            }
        } catch (err) {
            console.error(err);
            throw '프로젝트 수정에 문제가 생겼습니다. 다시 시도해주세요.';
        }
    }

    async deleteProject(userId, projectId) {
        try {
            const project = await Project.findOne({ _id: projectId });
            if (userId.toString() === project.requester.toString()) {
                await Project.deleteOne({ _id: projectId });
            } else {
                throw '허가되지 않은 접근입니다.';
            }
        } catch (err) {
            console.error(err);
            throw '프로젝트 삭제에 문제가 생겼습니다. 다시 시도해주세요.';
        }
    }

    async getProjectList() {
        try {
            return await Project.find({});
        } catch (err) {
            console.error(err);
            throw '프로젝트 목록을 조회하는데 오류가 발생했습니다. 다시 시도해주세요.';
        }
    }

    async selectPerformer(userId, projectId, proposalId) {
        try {
            let project = await Project.findOne({ _id: projectId });
            if (project) {
                if (userId.toString() === project.requester.toString()) {
                    const proposal = await Proposal.findOne({ _id: proposalId });
                    project.performer = proposal.proponent;
                    await Project.findByIdAndUpdate(projectId, project)
                } else {
                    throw '허가되지 않은 접근입니다.';
                }
            } else {
                throw '존재하지 않는 프로젝트입니다.';
            }
        } catch (err) {
            console.error(err);
            throw '프로젝트 확정에 오류가 발생했습니다. 다시 시도해주세요.';
        }
    }

    async readProposal(proposalId) {
        try {
            return await Proposal.findOne({ _id: proposalId });
        } catch (err) {
            console.error(err);
            throw '프로젝트 목록을 조회하는데 오류가 발생했습니다. 다시 시도해주세요.';
        }
    }

    async sendProposal(proposalDTO) {
        try {
            let project = await Project.findOne({ _id: proposalDTO.project });
            if (project) {
                const proposal = new Proposal(proposalDTO);
                await proposal.save();
                project.proposals.push(proposal._id);
                await Project.findByIdAndUpdate(proposalDTO.project, project);
            } else {
                throw '존재하지 않는 프로젝트입니다.';
            }
        } catch (err) {
            console.error(err);
            throw '프로젝트 제안에 오류가 발생했습니다. 다시 시도해주세요.';
        }
    }

    async getProposalList(projectId) {
        try {
            const project = await Project.findOne({ _id: projectId });
            let proposalList = [];
            const promises = project.proposals.map(async (proposalId, _) => {
                const proposal = await Proposal.findOne({ _id: proposalId });
                proposalList.push(proposal);
            });
            await Promise.all(promises);
            return proposalList;
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new ProjectService();