const cartModel = require('../dao/carts.model');

const createCart = async (req, res) => {

    const { products } = req.body;

    const newCart = {
        products
    }

    const cart = await cartModel.create(newCart);

    res.status(201).json({ message: 'Carrito creado', data: cart });
}

const getCartById = async (req, res) => {

    const { cid } = req.params;

    const cart = await cartModel.findById(cid);

    if (!cart) {
        res.status(404).json({ message: 'No se encontró el carrito' });
    }

    res.status(200).json(cart);
}

const addProductToCart = async (req, res) => {

    const { cid, pid } = req.params;

    let cart = await cartModel.findById(cid);

    if (!cart) {
        res.status(404).json({ message: 'No se encontró el carrito' });
    }

    const product = cart.products.find(item => item.product == pid)

    if (product) {
        cart = await cartModel.findByIdAndUpdate(cid, {
            $inc: { 'products.$[elem].quantity': 1 }
        }, {
            arrayFilters: [{ 'elem.product': Number(pid) }]
        })
    } else {

        cart = await cartModel.findByIdAndUpdate(cid, {
            $push: { products: { product: Number(pid), quantity: 1 } }
        })
    }

    res.status(201).json({ message: 'Producto agregado al carrito', data: cart });
}

const removeProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;

    let cart = await cartModel.findById(cid);

    if (!cart) {
        return res.status(404).json({ message: 'No se encontró el carrito' });
    }

    cart = await cartModel.findByIdAndUpdate(cid, {
        $pull: { products: { product: Number(pid) } }
    }, { new: true });

    return res.status(200).json({ message: 'Producto eliminado del carrito', data: cart });
}

const updateCart = async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    let cart = await cartModel.findById(cid);

    if (!cart) {
        return res.status(404).json({ message: 'No se encontró el carrito' });
    }

    console.log(req.body)
    cart = await cartModel.findByIdAndUpdate(cid, { products }, { new: true });
    console.log(cart)

    return res.status(200).json({ message: 'Carrito actualizado', data: cart });
}

const updateProductQuantityInCart = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    let cart = await cartModel.findById(cid);

    if (!cart) {
        return res.status(404).json({ message: 'No se encontró el carrito' });
    }

    const product = cart.products.find(item => item.product == pid)

    if (product) {
        cart = await cartModel.findByIdAndUpdate(cid, {
            $set: { 'products.$[elem].quantity': Number(quantity) }
        }, {
            arrayFilters: [{ 'elem.product': Number(pid) }],
            new: true
        })
    } else {
        return res.status(404).json({ message: 'No se encontró el producto en el carrito' });
    }

    return res.status(200).json({ message: 'Cantidad de producto actualizada en el carrito', data: cart });
}

const clearCart = async (req, res) => {
    const { cid } = req.params;

    let cart = await cartModel.findById(cid);

    if (!cart) {
        return res.status(404).json({ message: 'No se encontró el carrito' });
    }

    cart = await cartModel.findByIdAndUpdate(cid, { products: [] }, { new: true });

    return res.status(200).json({ message: 'Carrito limpiado', data: cart });
}

module.exports = {
    createCart,
    getCartById,
    addProductToCart,
    removeProductFromCart,
    updateCart,
    updateProductQuantityInCart,
    clearCart
}
