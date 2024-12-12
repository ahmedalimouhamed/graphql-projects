const path = require('path');
const {loadFilesSync} = require('@graphql-tools/load-files');
const {mergeResolvers, mergeTypeDefs} = require('@graphql-tools/merge');

const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, './schemas/*.graphql')));
const resolvers = mergeResolvers(loadFilesSync(path.join(__dirname, './resolvers/*.js')));


module.exports = {
    typeDefs,
    resolvers
}