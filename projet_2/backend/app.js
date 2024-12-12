const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const {typeDefs, resolvers} = require('./src/graphql');

// Add debug logs
console.log('TypeDefs:', typeDefs);
console.log('Resolvers:', JSON.stringify(resolvers, null, 2));

console.log('Loaded resolvers:', Object.keys(resolvers));
console.log('Mutation resolvers:', Object.keys(resolvers.Mutation || {}));

const app = express();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const apolloServer = new ApolloServer({
    typeDefs, 
    resolvers,
    context: ({req}) => {
        const token = req.headers.authorization?.split(' ')[1] || null;
        const user = token ? jwt.verify(token, process.env.SECRET_KEY) : null;
        return {user};
    },
    formatError: (error) => {
        console.error('GraphQL Error:', error);
        return {
            message: error.message,
            path: error.path,
            extensions: error.extensions,
            locations: error.locations,
        };
    },
});

apolloServer.start().then(() => {
    apolloServer.applyMiddleware({app});
});

module.exports = app;