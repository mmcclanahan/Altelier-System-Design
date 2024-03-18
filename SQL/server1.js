require('dotenv').config();
const express = require('express');
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.json());



app.listen(process.env.PORT || 3000, () => {
  console.log(`server started on port ${process.env.PORT}`)
})