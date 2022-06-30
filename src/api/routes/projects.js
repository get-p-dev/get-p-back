// Module
const express = require('express');
const passport = require('passport');
const router = express.Router();
const ProjectService = require('../../services/ProjectService');

// 전체 프로젝트 목록 조회
router.get('/', async (req, res) => {
    try {
        const projects = await ProjectService.getProjectList();
        console.log(`[GET] /projects`);  
        res.status(200).json(projects);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

// 프로젝트 생성
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (req.user.category === "company") {
            let projectDTO = req.body;
            projectDTO.requester = req.user._id;
            await ProjectService.createProject(projectDTO);
            console.log(`[POST] /projects ${req.user.email}`);   
            res.status(200).send();
        } else {
            res.status(403).json({ message: '프로젝트 생성은 회사만 가능합니다.' });
        }
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

// 프로젝트 조회
router.get('/:projectId', async (req, res) => {
    try {
        const project = await ProjectService.readProject(req.params.projectId);
        console.log(`[GET] /projects/${req.params.projectId}`);  
        res.status(200).json(project);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

// 프로젝트 수정
router.put('/:projectId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        await ProjectService.updateProject(req.user._id, req.params.projectId, req.body);
        console.log(`[PUT] /projects/${req.params.projectId}`);  
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err });
    }
});

// 프로젝트 삭제
router.delete('/:projectId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        await ProjectService.deleteProject(req.user._id, req.params.projectId);
        console.log(`[DELETE] /projects/${req.params.projectId}`);  
        res.status(200).send();
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

// 수행자 선택
router.post('/:projectId/performer', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        await ProjectService.selectPerformer(req.user._id, req.params.projectId, req.body.proposalId);
        console.log(`[POST] /projects/${req.params.projectId}/performer`);  
        res.status(200).send();
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

// 제안 전송
router.post('/:projectId/proposals', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let proposalDTO = req.body;
        proposalDTO.proponent = req.user._id;
        proposalDTO.project = req.params.projectId;
        await ProjectService.sendProposal(proposalDTO);
        console.log(`[POST] /projects/${req.params.projectId}/proposals`);  
        res.status(200).send();
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

// 전체 제안 목록 조회
router.get('/:projectId/proposals', async (req, res) => {
    try {
        const proposals = await ProjectService.getProposalList(req.params.projectId);
        console.log(`[GET] /projects/${req.params.projectId}/proposals`);  
        res.status(200).json(proposals);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

// 제안 조회
router.get('/:projectId/proposals/:proposalId', async (req, res) => {
    try {
        const proposal = await ProjectService.readProposal(req.params.proposalId);
        console.log(`[GET] /projects/${req.params.projectId}/proposals/${req.params.proposalId}`);  
        res.status(200).json(proposal);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

module.exports = router;