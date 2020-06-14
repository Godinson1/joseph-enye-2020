

export {};
const routes = require('./route/places');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('config');


const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4000;
const uri = config.get("ATLAS_URL");

mongoose.connect(uri, 
    { useNewUrlParser: true, useUnifiedTopology: true, 
useCreateIndex: true});

const connection = mongoose.connection;

connection.on('open', () => {
    console.log("Connection to MongoDB Atlas established successfully");
});

app.use('/places', routes);

app.listen(PORT, () => {
    console.log(`Server running at PORT: ${PORT}`);
})