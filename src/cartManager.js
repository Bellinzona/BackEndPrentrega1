const { json } = require("express");
const fs = require("fs");

class CarritoManager {
    static id = 0;

    constructor(path) {
        this.path = path;

        // Inicializa el archivo con un objeto que tiene una propiedad "carritos" que es un array vacío.
        fs.writeFileSync(path, JSON.stringify({ carritos: [] }, null, "\t"));
    }

    async addItem(item) {
        const content = await fs.promises.readFile(this.path, "utf-8");
        const data = JSON.parse(content);

        let itemCarrito = { id: ++CarritoManager.id, items: [] };
        data.carritos.push(itemCarrito); // Agrega el nuevo item al array "carritos".

        await fs.promises.writeFile(this.path, JSON.stringify(data, null, "\t"));
    }

    async addProductinCarrito(id, ProductId, productsFilePath) {
        try {
            const carritoContent = await fs.promises.readFile(this.path, "utf-8");
            const productsContent = await fs.promises.readFile(productsFilePath, "utf-8");
    
            const carritoData = JSON.parse(carritoContent);
            const productsData = JSON.parse(productsContent);

            console.log(productsData.items[1].id)
    
            // Verificar si el producto existe en el archivo de productos
            const productExists = productsData.items.some(product => product.id == ProductId);
    
            if (!productExists) {
                throw new Error(`Producto con id ${ProductId} no encontrado en el archivo de productos.`);
            }
    
            const carritoIndex = carritoData.carritos.findIndex(c => c.id == id);
            let carritoElegido = carritoData.carritos[carritoIndex];
    
            // Buscar si el producto ya existe en el carrito
            const existingProductIndex = carritoElegido.items.findIndex(p => p.item == ProductId);
    
            if (existingProductIndex !== -1) {
                // Si el producto ya existe, incrementar la cantidad
                carritoElegido.items[existingProductIndex].quantity += 1;
            } else {
                // Si el producto no existe, agregarlo con cantidad 1
                carritoElegido.items.push({ item: ProductId, quantity: 1 });
            }
    
            carritoData.carritos[carritoIndex] = carritoElegido;
    
            await fs.promises.writeFile(this.path, JSON.stringify(carritoData, null, "\t"));
        } catch (error) {
            // Manejar errores de lectura o parseo de archivos
            console.error(`Error al agregar producto al carrito: ${error.message}`);
            throw error;
        }
    }
    

        async getItem(id) {
        const content = await fs.promises.readFile(this.path, "utf-8");
        const data = JSON.parse(content);

        const item = data.carritos.find(c => c.id == id);

        return item;
    }


    async getItems(){
        const content = await fs.promises.readFile(this.path, "utf-8");
        const data = JSON.parse(content);

        return data

    }
}

module.exports = CarritoManager;
