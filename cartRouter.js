const express = require('express');
const fs = require('fs').promises;
const productManager = require('./productManager');
const cartRouter = express.Router();

cartRouter.post('/', async (req, res) => {
    try {
        const cart = await createCart();
        res.json({ cart });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

cartRouter.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await getCart(cartId);
        res.json({ cart });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

cartRouter.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = parseInt(req.params.pid);
    const quantity = req.body.quantity || 1;
    try {
        const updatedCart = await addProductToCart(cartId, productId, quantity);
        res.json({ cart: updatedCart });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

async function createCart() {
    try {
        const productData = await fs.readFile('./productos.json', 'utf8');
        const products = JSON.parse(productData);

        const cartId = generateUniqueId();
        const cart = { id: cartId, products: [] };


        cart.products = products.map(product => ({
            product: product.id,
            quantity: 0
        }));

        await saveCart(cart);
        return cart;
    } catch (error) {
        console.error('Error al crear el carrito:', error.message);
        throw new Error('Error al crear el carrito');
    }
}

async function getCart(cartId) {
    const cart = await loadCart(cartId);
    return cart;
}

async function addProductToCart(cartId, productId, quantity) {
    let cart = await loadCart(cartId);
    const existingProductIndex = cart.products.findIndex(p => p.product === productId);

    if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += quantity;
    } else {
        cart.products.push({ product: productId, quantity });
    }

    await saveCart(cart);
    return cart;
}

async function loadCart(cartId) {
    try {
        await fs.access('./carrito.json');
        const data = await fs.readFile('./carrito.json', 'utf8');
        const carts = JSON.parse(data);
        const cart = carts.find(c => c.id === cartId);
        return cart || { id: cartId, products: [] };
    } catch (error) {
        console.error('Error al cargar el carrito:', error.message);
        return { id: cartId, products: [] };
    }
}

async function saveCart(cart) {
    try {
        let data;

        try {
            data = await fs.readFile('./carrito.json', 'utf8');
        } catch (readError) {
            data = '[]';
        }

        const carts = JSON.parse(data);
        const existingIndex = carts.findIndex(c => c.id === cart.id);

        if (existingIndex !== -1) {
            carts[existingIndex] = cart;
        } else {
            carts.push(cart);
        }

        await fs.writeFile('./carrito.json', JSON.stringify(carts, null, 2));
    } catch (error) {
        console.error('Error al guardar el carrito:', error.message);
        throw new Error('Error al guardar el carrito');
    }
}

module.exports = cartRouter;
