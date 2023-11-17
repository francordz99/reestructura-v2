const express = require('express');
const { createCart, getCartById, addProductToCart, removeProductFromCart, updateCart, updateProductQuantityInCart, clearCart } = require('../controllers/carts.controller');

const cartsRouter = express.Router();

cartsRouter.post('/', createCart)
cartsRouter.get('/:cid', getCartById)
cartsRouter.post('/:cid/products/:pid', addProductToCart)
cartsRouter.delete('/:cid/products/:pid', removeProductFromCart);
cartsRouter.put('/:cid', updateCart);
cartsRouter.put('/:cid/products/:pid', updateProductQuantityInCart);
cartsRouter.delete('/:cid', clearCart);



module.exports = cartsRouter;