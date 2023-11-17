const mongoose = require('mongoose');


const productCollection = 'products';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: Boolean, required: true, default: true },
    stock: { type: Number, required: true },
    thumbnails: { type: Array, required: false },
    category: { type: String, required: true },
});

const productModel = mongoose.model(productCollection, productSchema);

module.exports = productModel;

