const express = require('express');
const productRouter = require('../productsRouter');
const cartRouter = require('../cartRouter');
const productManager = require('../productManager');

const app = express();
app.use(express.json());
app.use('/api/cart', cartRouter);
app.use('/api/products', productRouter);


const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});



