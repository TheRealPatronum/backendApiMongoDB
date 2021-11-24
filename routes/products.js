// Importing the product model
const { Product } = require('../models/product');

const express = require('express');
const router = express.Router();

// Get producs
// The / will be the same as http://localhost:port/api/v1/products
router.get('/', async (req, res) => {
  const productList = await Product.find();

  if (!productList) {
    res.send(500).json({ success: false });
  }
  res.send(productList);
});

// Add products
// The / will be the same as http://localhost:port/api/v1/products
router.post(`/`, (req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });

  // Saves posted data to mongodb Database
  product
    .save()
    .then((createdProduct) => {
      res.status(201).json(createdProduct);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});

// Exporting read/write routes for products
module.exports = router;
