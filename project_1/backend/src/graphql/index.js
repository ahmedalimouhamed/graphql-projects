const {loadFilesSync} = require('@graphql-tools/load-files');
const {mergeTypeDefs, mergeResolvers} = require('@graphql-tools/merge');

const typeDefs = mergeTypeDefs(loadFilesSync(`${__dirname}/**/*.graphql`));
const resolvers = mergeResolvers(loadFilesSync(`${__dirname}/**/*.js`));

module.exports = {
    typeDefs,
    resolvers
}