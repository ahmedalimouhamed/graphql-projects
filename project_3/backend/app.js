const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const mongoose = require('mongoose');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const {typeDefs, resolvers} = require('./src/graphql/index');
const app = express();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        const token = req.headers.authorization?.split(' ')[1];
        const user = token ? jwt.verify(token, process.env.SECRET_KEY) : null;
        return {user};
    }
});

apolloServer.start().then(() => {
    apolloServer.applyMiddleware({app});
});

module.exports = app;