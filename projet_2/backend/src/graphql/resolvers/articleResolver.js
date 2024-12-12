const Article = require('../../models/Article');
const User = require('../../models/User');

module.exports = {
    Query: {
        articles: async () => {
            return await Article.find().populate('author');
        },
        article: async (_, {id}) => {
            return await Article.findById(id).populate('author');
        }
    },
    Mutation: {
        createArticle: async (_, {input}) => {
            console.log(input);
            const { title, content } = input;
            const author = await User.findById(input.author);
            const article = await Article.create({ title, content, author });
            const populatedArticle = article.populate('author');
            console.log(populatedArticle);
            return populatedArticle;
        },

        updateArticle: async (_, {id, input}) => {
            const savedArticle = await Article.findByIdAndUpdate(id, input, {new: true});
            const populatedArticle = savedArticle.populate('author');
            return populatedArticle;
        },

        deleteArticle: async (_, {id}) => {
            return await Article.findByIdAndDelete(id);
        }
    }
}