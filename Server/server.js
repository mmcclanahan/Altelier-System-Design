require('dotenv').config();
const express = require('express');
const path = require("path");
const app = express();
//var router = require('./routes.js');
const {getProductById, getAll, getAllProductInfo, getAllProductInfoByName, getRelatedIds, getStyle} = require('./models.js');
//app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.json());
//app.use('', router);

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
//get product and its simple details
app.get('/product/:id', (req, res) => {
  getProductById(req.params.id)
  .then((response) => {
    res.status(200).send(response)
  })
  .catch((error)=> {
    res.status(500).send(error)
  })
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

app.get('/product/:id/styles', (req, res) => {
  getStyle(req.params.id)
  .then((response) => {
    res.status(200).send(response[0].results)
  })
  .catch((error)=> {
    res.status(500).send(error)
  })
})


app.get('/cart', (req, res) => {

})

//trying to use non aggregation
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




app.listen(process.env.PORT || 3000, () => {
  console.log(`server started on port ${process.env.PORT}`)
})