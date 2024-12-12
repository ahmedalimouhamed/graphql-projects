const path = require('path');
const {loadFilesSync} = require('@graphql-tools/load-files');
const {mergeTypeDefs, mergeResolvers} = require('@graphql-tools/merge');

// Load schema files
const typeDefs = mergeTypeDefs(
    loadFilesSync(path.join(__dirname, './schemas/*.graphql'))
);

// Load resolver files
const resolverFiles = loadFilesSync(path.join(__dirname, './resolvers/*.js'));
console.log('Loading resolvers from:', resolverFiles);
const resolvers = mergeResolvers(resolverFiles);

console.log('Merged resolvers:', JSON.stringify(resolvers, null, 2));

module.exports = {typeDefs, resolvers};