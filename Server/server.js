require('dotenv').config();
const express = require('express');
const path = require("path");
const app = express();
//route handlers
const {getProductById, getAll, getAllProductInfo, getAllProductInfoByName, getRelatedIds, getStyle} = require('./models.js');
//middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
//cache
const NodeCache = require("node-cache");
const simpleProductCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
const styleCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

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
  const cachedResult = simpleProductCache.get(req.params.id);
  if (!cachedResult) {
    getProductById(req.params.id)
    .then((response) => {
      simpleProductCache.set(req.params.id, response)
      res.status(200).send(response)
    })
    .catch((error)=> {
      res.status(500).send(error)
    })
  } else {
    res.status(200).send(cachedResult)
  }
})
//get related ids for a product
app.get('/product/related/:id', (req, res) => {
  getRelatedIds(req.params.id)
  .then((result) => {
    res.status(200).send(result)
  })
  .catch((err) => {
    res.status(500).send(err)
  })
})
//get all styles for a product
app.get('/product/styles/:id', (req, res) => {
  const cachedResult = styleCache.get(req.params.id);
  if (!cachedResult) {
    getStyle(req.params.id)
    .then((response) => {
      styleCache.set(req.params.id, response)
      res.status(200).send(response)
    })
    .catch((error)=> {
      res.status(500).send(error)
    })
  } else {
    res.status(200).send(cachedResult)
  }
})

/*
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
*/

app.listen(process.env.PORT || 3000, () => {
  console.log(`server started on port ${process.env.PORT}`)
})