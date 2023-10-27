const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const apiRoutes = require('./Router/user.js'); // Verify the correct path
const mongodb = require('./mongo/DB.js'); // Verify the correct path

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

const mongo = mongoose.connect(mongodb.url, { useNewUrlParser: true, useUnifiedTopology: true }); // Properly configure the connection options
mongo.then(() => {
    console.log("Server Connected to MongoDB");
}).catch(error => {
    console.log("Error while connecting to MongoDB:", error);
});

const port = process.env.PORT || 7000;
app.listen(port, () => {
    console.log("Server running on port " + port);
});

app.get('/', (req, res) => {
    res.send("Welcome to signin page");
});

app.use('/api', apiRoutes);

module.exports = app;
