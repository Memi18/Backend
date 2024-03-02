const express = require('express');
const ProductManager = require('./productManager');
const productRouter = express.Router();
const productManager = new ProductManager('productos.json');

productRouter.get('/', (req, res) => {
    const limit = req.query.limit;
    const products = productManager.getLimitedProducts(limit);
    res.json({ products });
});

productRouter.get('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    productManager.getProductById(productId)
        .then(product => res.json({ product }))
        .catch(error => res.status(404).json({ error: error }));
});

productRouter.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, thumbnails, category } = req.body;
        const product = await productManager.addProduct(title, description, price, thumbnails, code, stock, category);
        res.json({ product });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

productRouter.put('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    const updatedFields = req.body;
    try {
        const updatedProduct = await productManager.updateProduct(productId, updatedFields);
        res.json({ product: updatedProduct });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

productRouter.delete('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        await productManager.deleteProduct(productId);
        res.json({ message: `Producto con ID ${productId} eliminado` });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = productRouter;
