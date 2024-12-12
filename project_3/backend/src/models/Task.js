const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, default: ''},
    status: {type: String, enum:['To-Do', 'In-Progress', 'Done'],  default: 'To-Do'},
    project: {type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true},
    assignee: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
}, {timestamps: true});

module.exports = mongoose.model('Task', taskSchema);