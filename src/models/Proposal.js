const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
    project: {
        type: mongoose.ObjectId,
        required: true
    },
    proponent: {
        type: mongoose.ObjectId,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Proposal = mongoose.model('Proposal', proposalSchema);

module.exports = Proposal;