const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {type : String, required: true},
    content: {type : String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    likes: {type: Number, default: 0}
}, {
    timestamps: true
});

module.exports = mongoose.model('Article', articleSchema);