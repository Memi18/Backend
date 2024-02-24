const express = require('express');
const app = express();
const fs = require('fs');


const ProductManager = require('../productManager');


const productManager = new ProductManager('productos.json');



  productManager.addProduct(
    `Sarten 24CM `,
    `Linea Contemporanea`,
    222.505 ,
    `Imagen`,
    `1`,
    10 
  );
  productManager.addProduct(
    `Cacerola 18CM `,
    `Linea Contemporanea`,
    213.156 ,
    `-`,
    `2`,
    10 
  );
  productManager.addProduct(
    `Cacerola 24CM `,
    `Linea Contemporanea`,
    293.481 ,
    `Imagen`,
    `3`,
    10 
  );
  productManager.addProduct(
    `Cacerola 28CM `,
    `Linea Contemporanea`,
    380.896 ,
    `Imagen`,
    `4`,
    10 
  );
  productManager.addProduct(
    `Sarten 28CM`,
    `Linea Contemporanea`,
    359.046 ,
    `Imagen`,
    `5`,
    10 
  );
  productManager.addProduct(
    `Sarten Chef `,
    `Linea Contemporanea`,
    148.790 ,
    `Imagen`,
    `6`,
    10 
  );
  productManager.addProduct(
    `Flip 2.1 `,
    `Linea Contemporanea`,
    338.374 ,
    `Imagen`,
    `7`,
    10 
  );
  productManager.addProduct(
    `Fuente rectangular `,
    `Linea Contemporanea`,
    353.141 ,
    `Imagen`,
    `8`,
    10 
  );
  productManager.addProduct(
    `Bifera con asas `,
    `Linea Contemporanea`,
    247.121 ,
    `Imagen`,
    `9`,
    10 
  );
  productManager.addProduct(
    `Wok `,
    `Linea Contemporanea`,
    196.039 ,
    `Imagen`,
    `10`,
    10 
  );
 


app.get('/products', (req, res) => {
  const limit = req.query.limit;
  const products = limit ? productManager.getProducts().slice(0, limit) : productManager.getProducts();
  res.json({ products });
});

app.get('/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  productManager.getProductById(productId)
    .then(product => res.json({ product }))
    .catch(error => res.status(404).json({ error: error }));
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
