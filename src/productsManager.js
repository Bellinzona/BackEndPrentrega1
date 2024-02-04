const { error } = require("console");
const { json } = require("express");
const fs = require("fs");

class productsManager {
    static id = 0;

    constructor(path) {
        this.path = path

        
    }

    async findHighestId() {
        const highestId = this.data.items.length > 0 ? Math.max(...this.data.items.map(item => item.id)) : 0;
        return highestId;
    }

    async init() {
        try {
            const content = await fs.readFile(this.path, 'utf-8');
            this.data = JSON.parse(content);
            this.id = this.findHighestId();
        } catch (error) {
            this.data = { items: [] };
            this.id = 0
        }
    }

    async addProduct(item) {
        const requiredProperties = ['id', 'titulo', 'descripcion', 'codigo', 'precio', 'status', 'stock'];

        // Verificar si todas las propiedades requeridas están presentes en el objeto item
        const propiedadesFaltantes = requiredProperties.filter(prop => !(prop in item));

        if (propiedadesFaltantes.length > 0) {
            // Si faltan propiedades, lanzar un error 404
            const error = new Error(`Faltan propiedades obligatorias: ${propiedadesFaltantes.join(', ')}`);
            error.status = 404;
            throw error;
        }else{
            const content = await fs.promises.readFile(this.path, "utf-8");
            const data = JSON.parse(content);
    
        item.id = ++productsManager.id;
        
        data.items.push(item); // Agrega el nuevo item al array "items".
    
        await fs.promises.writeFile(this.path, JSON.stringify(data, null, "\t"));

        }

    }

    async getProducts() {
        const content = await fs.promises.readFile(this.path, "utf-8");
        const data = JSON.parse(content);

        console.log(data.items);

        return data.items;
    }

    async getProduct(id){
        const content = await fs.promises.readFile(this.path, "utf-8");
        const data = JSON.parse(content);

        const product = data.items.find(i => i.id == id)


        return product

    }


    async deleteProduct(id) {
        const content = await fs.promises.readFile(this.path, "utf-8");
        const data = JSON.parse(content);
    
        const itemIndex = data.items.findIndex(i => i.id == id);
    
        if (itemIndex !== -1) {
            // Si el producto existe, eliminarlo del array
            data.items.splice(itemIndex, 1);
    
            await fs.promises.writeFile(this.path, JSON.stringify(data, null, "\t"));
    
            return data.items;
        } else {
            // Si el producto no existe, devolver null o lanzar un error según tu preferencia
            return null;
        }
    }


    async updateProduct(id, updatedItem) {
        const content = await fs.promises.readFile(this.path, "utf-8");
        const data = JSON.parse(content);
    
        const itemIndex = data.items.findIndex(i => i.id == id);
    
        if (itemIndex !== -1) {
            // Guarda el id actual antes de la actualización
            const originalId = data.items[itemIndex].id;
    
            // Actualiza las propiedades del producto sin cambiar el id
            data.items[itemIndex] = { ...data.items[itemIndex], ...updatedItem };
    
            // Restaura el id original
            data.items[itemIndex].id = originalId;
    
            await fs.promises.writeFile(this.path, JSON.stringify(data, null, "\t"));
    
            // Devolver el array actualizado
            return data.items;
        } else {
            // Si el producto no existe, devolver null o lanzar un error según tu preferencia
            return null;
        }
    }
    
}




module.exports = productsManager