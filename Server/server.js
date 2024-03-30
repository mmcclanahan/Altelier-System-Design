require('dotenv').config();
const express = require('express');
//const morgan = require('morgan');
const path = require("path");
const app = express();

//import routes
const productRoutes = require('./routes/productRoutes');

//middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
//app.use(morgan('combined'));

const productController = require('./controllers/productControllers');

app.get('/product/:id', productController.getProduct);
app.get('/product/styles/:id', productController.getProductStyle);
app.get('/product/related/:id', productController.getProductRelated);
app.get('/product/complete/:id', productController.getCompleteProduct);

app.listen(process.env.PORT || 3000, () => {
  console.log(`server started on port ${process.env.PORT}`)
});