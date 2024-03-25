require('dotenv').config();
const express = require('express');
const path = require("path");
const app = express();
//var router = require('./routes.js');
const {getProductById, getAll, getAllProductInfo, getAllProductInfoByName, getRelatedIds} = require('./models.js');
//app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.json());
//app.use('', router);

//get basic details and features for a product
app.get('/product/:id', (req, res) => {
  getProductById(req.params.id)
  .then((response) => {
    res.status(200).send(response)
  })
  .catch((error)=> {
    res.status(500).send(error)
  })
})
app.get('/productAll', (req, res) => {
  getAll(req.params.id)
  .then((result) => {
    res.status(200).send(result)
  })
  .catch((error) => {
    res.status(500).send(error)
  })
})
//optimized aggregation with search for non indexed value
app.get('/productDetailsName/:name', (req, res) => {
  getAllProductInfoByName(req.params.name)
    .then((result) => {
        res.status(200).send(result)
    })
    .catch((err) => {
        console.error('Error:', err);
    })
})
//get all styles for a product Stylefind(product_id) and photos and skus for styles
//optimized aggregation with search for indexed value//
app.get('/productDetails/:id', (req, res) => {
  getAllProductInfo(req.params.id)
    .then((result) => {
        res.status(200).send(result[0]);
    })
    .catch((err) => {
        console.error('Error:', err);
    });
})
//get all skus for a style
//get cart for a user session
app.get('/cart', (req, res) => {

})
//get related ids for a product
app.get('/product/related/:id', (req, res) => {
  getRelatedIds(req.params.id)
  .then((result) => {
    res.status(200).send(result[0].related_ids)
  })
  .catch((err) => {
    res.status(500).send(err)
  })
})
//get all related products for product
//



app.listen(3002, () => {
  console.log(`server started on port 3002`)
})