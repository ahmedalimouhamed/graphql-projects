const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const mongoose = require('mongoose');
require('dotenv').config();

const {typeDefs, resolvers} = require('./src/graphql');

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        const token = req.headers?.authorization?.split(" ")[1];
        
        let user = null;

        if(token){
            const jwt = require('jsonwebtoken');

            try{
                user = jwt.verify(token, process.env.JWT_SECRET);
            }catch(err){
                console.log(err);
            }
        }

        return {user};
    }
});

server.start().then(() => {
    server.applyMiddleware({app, path: "/graphql"});

    app.get("/", (req, res) => {
        res.send("Api is running...");
    });

});

module.exports = app;