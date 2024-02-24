const fs = require("fs");

class ProductManager {
    constructor(path) {
        this.products = [];
        this.productIdCounter = 1;
        this.path = path;
        this.loadProductsFromFile();
    }

    saveProductsToFile() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            throw new Error(`El archivo no pudo ser escrito.`);
        }
    }

    loadProductsFromFile() {
        try {
            const data = fs.readFileSync(this.path, "utf8");
    
            this.products = JSON.parse(data);
    
            if (!Array.isArray(this.products) || this.products.length === 0) {
                
                this.products = [];
            } else {
                this.productIdCounter = Math.max(...this.products.map((product) => product.id)) + 1;
            }
        } catch (error) {
            
            console.error(`Error en la carga de archivos: ${error.message}`);
            this.products = [];
        }
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        return new Promise((resolve, reject) => {
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                reject("Se deben completar todos los campos");
            } else if (this.products.some((product) => product.code === code)) {
                reject(` El código "${code}" ya existe `);
            } else {
                const product = {
                    id: this.productIdCounter++,
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock,
                };
                this.products.push(product);
                this.saveProductsToFile();
                resolve(console.log(`El producto "${title}" se agregó con éxito.`));
            }
        });
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        return new Promise((resolve, reject) => {
            const product = this.products.find((product) => product.id === id);
            if (product) {
                console.log("El producto se encontró:", product);
                resolve(product);
            } else {
                reject("El producto no se encontró");
            }
        });
    }

    updateProduct(id, updatedFields) {
        return new Promise((resolve, reject) => {
            const index = this.products.findIndex((product) => product.id === id);

            if (index !== -1) {
                updatedFields.id = id;
                this.products[index] = updatedFields;
                this.saveProductsToFile();
                resolve(
                    console.log(`El producto con id ${id} se actualizó con éxito.`)
                );
            } else {
                reject(`El producto con id ${id} no existe.`);
            }
        });
    }

    deleteProduct(id) {
        return new Promise((resolve, reject) => {
            const index = this.products.findIndex((product) => product.id === id);

            if (index !== -1) {
                this.products.splice(index, 1);
                this.saveProductsToFile();
                resolve(console.log(`El producto con id ${id} se eliminó con éxito.`));
            } else {
                reject(`El producto con id ${id} no existe.`);
            }
        });
    }
}

module.exports = ProductManager;
