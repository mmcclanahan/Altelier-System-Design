const { getProductById, getAllProductInfo, getRelatedIds, getStyle } = require('../../DB/queries.js');

const NodeCache = require("node-cache");
const simpleProductCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
const styleCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

exports.getProduct = (req, res) => {
  const cachedResult = simpleProductCache.get(req.params.id);
  if (!cachedResult) {
    getProductById(req.params.id)
    .then((response) => {
      simpleProductCache.set(req.params.id, response)
      res.status(200).send(response)
    })
    .catch((error)=> {
      res.status(400).send(error)
    })
  } else {
    res.status(200).send(cachedResult)
  }
}

exports.getProductStyle = (req, res) => {
  const cachedStyle = styleCache.get(req.params.id);
  if (!cachedStyle) {
    getStyle(req.params.id)
    .then((response) => {
      styleCache.set(req.params.id, response)
      res.status(200).send(response)
    })
    .catch((error)=> {
      res.status(400).send(error)
    })
  } else {
    res.status(200).send(cachedStyle)
  }
}

exports.getProductRelated = (req, res) => {
  getRelatedIds(req.params.id)
  .then((result) => {
    res.status(200).send(result)
  })
  .catch((err) => {
    res.status(400).send(err)
  })
}

exports.getCompleteProduct = (req, res) => {
  getAllProductInfo(req.params.id)
    .then((result) => {
        res.status(200).send(result[0]);
    })
    .catch((err) => {
        console.error('Error:', err);
    });
}