const productModel = require('../dao/products.model');

const getProducts = async (req, res) => {

    let limit = 10
    let page = 1;
    let sort = {}
    let query = {}

    if (req.query.limit) limit = parseInt(req.query.limit)
    if (req.query.page) page = parseInt(req.query.page)
    if (req.query.sort) sort.price = req.query.sort === 'desc' ? -1 : 1
    if (req.query.query) query = { title: req.query.query }
    if (req.query.category) query.category = req.query.category;


    if (req.query.status) {
        query.status = req.query.status.toLowerCase() === 'true';
    }
    try {
        const products = await productModel
            .find(query)
            .sort(sort)
            .limit(limit)
            .skip((page - 1) * limit);

        let totalProducts = 0
        if (req.query) {
            totalProducts = await productModel.countDocuments(query);
        } else {
            totalProducts = await productModel.countDocuments();
        }
        const totalPages = Math.ceil(totalProducts / limit);

        if (!products.length) {
            res.status(404).json({ message: "No hay productos cargados" })
        }

        res.status(200).json({
            status: "success",
            payload: products,
            totalPages: totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            page: page,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: page > 1 ? `http://localhost:8080/api/products?page=${page - 1}` : null,
            nextLink: page < totalPages ? `http://localhost:8080/api/products?page=${page + 1}` : null,
        });
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}


const createProduct = async (req, res) => {

    const { title, description, code, price, stock, thumbnails, category } = req.body;

    if (!title || !description || !price || !code || !stock || !category) {
        res.status(400).json({ message: 'Falta información del producto, no se puede crear sin información completa' });
    }

    const newProduct = {
        title,
        description,
        code,
        price,
        status: true,
        stock,
        thumbnails,
        category,
    };

    await productModel.create(newProduct);

    req.io.sockets.emit('new-product', newProduct);

    res.status(201).json({ message: 'Product created', data: newProduct });
}

const getProductById = async (req, res) => {

    const { pid } = req.params;
    let product = await productModel.findById(pid);

    if (!product) {
        res.status(404).json({ message: 'No se encontró el producto' });
    }

    res.status(200).json(product);
}

const updateProduct = async (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, status, stock, thumbnails, category } = req.body;

    let productExists = await productModel.findById(pid);

    if (!productExists) {
        res.status(404).json({ message: 'No se encontró el producto' });
        return;
    }

    let product = await productModel.findByIdAndUpdate(pid, {
        title,
        description,
        code,
        price,
        status,
        stock,
        thumbnails,
        category,
    }, { new: true });

    res.status(200).json({ message: 'Product updated', data: product });
}

const deleteProduct = async (req, res) => {
    const { pid } = req.params;

    const product = await productModel.findByIdAndDelete(pid);

    if (!product) {
        res.status(404).json({ message: 'No se encontró el producto' });
        return;
    }

    req.io.sockets.emit('deleted-product', pid);

    res.status(200).json({ message: 'Product deleted', data: product });
}

module.exports = {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
}