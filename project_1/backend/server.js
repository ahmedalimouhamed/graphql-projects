const http = require('http');
const app = require('./app');

require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("GraphQL server running on http://localhost:5000/graphql");
});