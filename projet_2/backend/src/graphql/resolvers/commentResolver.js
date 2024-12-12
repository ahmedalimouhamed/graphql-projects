const Comment = require('../../models/Comment');

module.exports = {
    Query: {
        comments: async () => {
            return await Comment.find().populate('author').populate('article');
        },
        comment: async (_, {id}) => {
            return await Comment.findById(id).populate('author').populate('article');
        }
    },
    Mutation: {
        createComment: async (_, {input}) => {
            const { content, articleId, authorId } = input;
            const comment = await Comment.create({ 
                content, 
                article: articleId, 
                author: authorId 
            });
            
            console.log('Created comment:', comment);
            
            return await comment.populate(['author', 'article']);
        },
        updateComment: async (_, {id, input}) => {
            const savedComment = await Comment.findByIdAndUpdate(id, input, {new: true});
            const populatedComment = savedComment.populate(['author', 'article'])
            return populatedComment;
        },
        deleteComment: async (_, {id}) => {
            return await Comment.findByIdAndDelete(id);
        }
    }
}