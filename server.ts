export {};
//Import packages
const express = require('express');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const config = require('config');
const schema = require('./model/schema');
const routes = require('./route/places')

//Initialize express and cors
const app = express();
app.use(express.json());
app.use(cors());

//Configure PORT and get Mongo Atlas Key
const PORT = process.env.PORT || 4000;
const uri = config.get("ATLAS_URL");

//Connect MongoDB
mongoose.connect(uri, 
    { useNewUrlParser: true, useUnifiedTopology: true, 
useCreateIndex: true});

const connection = mongoose.connection;

connection.on('open', () => {
    console.log("Connection to MongoDB Atlas established successfully");
});

//App Route for Search (Persisting data)
app.use('/places', routes);

//App Route for retrieving data using graphql
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

//Listen for Port Server is connected to
app.listen(PORT, () => {
    console.log(`Server running at PORT: ${PORT }`)
})