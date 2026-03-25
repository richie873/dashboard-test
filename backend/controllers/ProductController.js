const productService = require('../services/productService');

async function getProducts(req, res) { 
    try {
        const products = await productService.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getProducts
}