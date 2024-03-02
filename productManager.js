const fs = require("fs").promises;

class ProductManager {
    constructor(path) {
        this.products = [];
        this.productIdCounter = 1;
        this.path = path;
        this.loadProductsFromFile();
    }

    async saveProductsToFile() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            throw new Error(`El archivo no pudo ser escrito: ${error.message}`);
        }
    }

    async loadProductsFromFile() {
        try {
            const data = await fs.readFile(this.path, "utf8");

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

    async addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error("Se deben completar todos los campos");
        } else if (this.products.some((product) => product.code === code)) {
            throw new Error(` El código "${code}" ya existe `);
        } else {
            const product = {
                id: this.productIdCounter++,
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                status: true
            };
            this.products.push(product);
            await this.saveProductsToFile();
            console.log(`El producto "${title}" se agregó con éxito.`);
            return product;
        }
    }

    getProducts() {
        return this.products;
    }

    async getProductById(id) {
        return new Promise(async (resolve, reject) => {
            const product = this.products.find((product) => product.id === id);
            if (product) {
                console.log("El producto se encontró:", product);
                resolve(product);
            } else {
                reject("El producto no se encontró");
            }
        });
    }

    async updateProduct(id, updatedFields) {
        return new Promise(async (resolve, reject) => {
            const index = this.products.findIndex((product) => product.id === id);

            if (index !== -1) {
                updatedFields.id = id;
                this.products[index] = updatedFields;
                await this.saveProductsToFile();
                resolve(
                    console.log(`El producto con id ${id} se actualizó con éxito.`)
                );
            } else {
                reject(`El producto con id ${id} no existe.`);
            }
        });
    }

    async deleteProduct(id) {
        return new Promise(async (resolve, reject) => {
            const index = this.products.findIndex((product) => product.id === id);

            if (index !== -1) {
                this.products.splice(index, 1);
                await this.saveProductsToFile();
                resolve(console.log(`El producto con id ${id} se eliminó con éxito.`));
            } else {
                reject(`El producto con id ${id} no existe.`);
            }
        });
    }
    getLimitedProducts(limit) {
        return limit ? this.products.slice(0, limit) : this.products;
    }
}

module.exports = ProductManager;