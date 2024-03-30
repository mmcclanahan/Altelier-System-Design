const express = require('express');
const router = express.Router();

//import controllers
const productController = require('../controllers/productControllers');

//routing
router.get('/:id', productController.getProduct);
router.get('/styles/:id', productController.getProductStyle);
router.get('/related/:id', productController.getProductRelated);
router.get('complete/:id', productController.getCompleteProduct);
module.exports = router;