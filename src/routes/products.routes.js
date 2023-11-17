const express = require('express');
const { getProducts, createProduct, getProductById, updateProduct, deleteProduct } = require('../controllers/products.controller');

const productsRouter = express.Router();

productsRouter.get('/', getProducts)
productsRouter.post('/', createProduct)

productsRouter.get('/:pid', getProductById)
productsRouter.put('/:pid', updateProduct)
productsRouter.delete('/:pid', deleteProduct)

module.exports = productsRouter;