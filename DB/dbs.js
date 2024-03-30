require("dotenv").config();
const mongoose = require('mongoose');

//for aws
const mongoURL = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.URL}:${process.env.PORT}/${process.env.DB_NAME}?authSource=admin`;
//for local testing
//const mongoURL = `mongodb://localhost:27017/PROD`

mongoose.connect(mongoURL)
.then(() => console.log('Connected to the database'))
.catch((error) => console.error('connection error:', error));


module.exports = mongoose;