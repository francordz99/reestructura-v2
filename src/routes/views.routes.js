const express = require('express');
const data = require('../data.json');
const cartModel = require('../dao/carts.model');
const productModel = require('../dao/products.model');
const axios = require('axios');

const products = data.products

const viewsRouter = express.Router()


viewsRouter.get('/', (req, res) => {
    res.render('home', {
        products,
        style: 'styles.css'
    })
})

viewsRouter.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {
        products,
        style: 'styles.css'
    })
})

viewsRouter.get('/products', async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    try {
        const response = await axios.get(`http://localhost:8080/api/products?page=${page}&limit=${limit}`);

        if (response.data && response.data.status === 'success') {
            const { payload: products, ...paginationData } = response.data;

            res.render('products', {
                products,
                ...paginationData,
                style: 'styles.css',
                user: req.session.user
            });
        } else {
            res.status(404).send('No hay productos cargados');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
})

viewsRouter.get('/product/:id', async (req, res) => {
    const product = await productModel.findById(req.params.id);
    if (product) {
        res.render('product', {
            product: product.toObject(),
            style: 'styles.css'
        })
    } else {
        res.status(404).json({ message: 'Producto no encontrado' })
    }
})


viewsRouter.get('/carts/:cid', async (req, res) => {
    const cart = await cartModel.findById(req.params.cid);

    if (!cart) {
        res.status(404).json({ message: 'Carrito no encontrado' });
    } else {
        res.render('cart', {
            cart: {
                ...cart.toObject(),
                products: cart.products.map(p => ({
                    product: p.product,
                    quantity: p.quantity
                }))
            },
            style: 'styles.css'
        });
    }
});

viewsRouter.get('/register', (req, res) => {
    res.render('register');
})

viewsRouter.get('/login', (req, res) => {
    res.render('login')
})

viewsRouter.get('/profile', (req, res) => {
    res.render('profile', {
        user: req.session.user
    })
})

module.exports = viewsRouter;