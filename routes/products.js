const { Product } = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');

// Get producs
// The / will be the same as http://localhost:port/api/v1/products
router.get(`/`, async (req, res) => {
  // localhost:3000/api/v1/products?categories=2342342,234234
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(',') };
  }
  // . populate makes it possible to get data from other schemas date are related and haf refferens to this schema in models
  const productList = await Product.find(filter).populate('category');

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

// Get product
// The /:id will be the same as http://localhost:port/api/v1/products/:id
router.get(`/:id`, async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category');

  if (!product) {
    res.status(500).json({ success: false });
  }
  res.send(product);
});

// Add products
// The / will be the same as http://localhost:port/api/v1/products
router.post(`/`, async (req, res) => {
  const category = await Category.findById(req.body.category);
  // Testing that user not try to add product in not existing category!
  if (!category) return res.status(400).send('Invalid Category');

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  product = await product.save();

  if (!product) return res.status(500).send('The product cannot be created');

  res.send(product);
});

// update info of a product
router.put('/:id', async (req, res) => {
  // Check that id exist
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('Invalid Product Id');
  }
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send('Invalid Category');

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );

  if (!product) return res.status(500).send('the product cannot be updated!');

  res.send(product);
});

// Delete product
router.delete('/:id', (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: 'the product is deleted!' });
      } else {
        return res.status(404).json({ success: false, message: 'product not found!' });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

// Count products
router.get(`/get/count`, (req, res) => {
  Product.countDocuments()
    .then((count) => {
      if (count) {
        return res.status(200).json({ productCount: count });
      } else {
        return res.status(500).json({ success: false });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        success: false,
        error: err,
      });
    });
});

// Only gets futured products
router.get(`/get/featured/:count`, async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({ isFeatured: true }).limit(+count);

  if (!products) {
    res.status(500).json({ success: false });
  }
  res.send(products);
});

module.exports = router;
