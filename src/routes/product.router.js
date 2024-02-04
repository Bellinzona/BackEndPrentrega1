const { Router } = require("express");
const router = Router()
const productManager = require("../productsManager")

const manager = new productManager(__dirname + "/../files/products.json")


async function iniciar(){
    try{
        await manager.init()
        console.log("datos cargados ccorrectamente")
    } catch (error){
        console.log("error al cargar datos", error.message)
    }
}



router.get("/", async (req,res) => {
    let items = await manager.getProducts()

    console.log(items)

    const { limit } = req.query;
    if (limit) {
        items = items.slice(0, limit);
    }

    res.send({items})
})

router.delete("/:iid", async (req,res) => {
    const id = req.params.iid

    const producto = await manager.getProduct(id)
    if(!producto){
        res.status(404).send({message:"no existe el producto"})
        return
    }

    const productosRestantes = await manager.deleteProduct(id)
    res.send({status:"succes", productosRestantes})
})

router.put("/:iid", async (req,res) => {
    const id = req.params.iid;
    const productoActualizado = req.body

    const productoExist = await manager.getProduct(id)

    if(!productoExist){
        res.status(404).send({message:"Producto no encontrado"})
        return;
    }

    const actualizarProducto = await manager.updateProduct(id,productoActualizado)

    res.send({status:"success", productoExist})
})

router.get("/:iid", async (req,res) => {
    const id = req.params.iid
    const producto = await manager.getProduct(id)


    try{
        if (!producto){
            res.status(400).send({message:"producto no encontrado"})
        } else {
            res.send({producto})
    
        }

    } catch(error){
        console.log("error")
    }

    

    
})

router.post("/", async (req, res) => {
    const productInfo = req.body;

    if (!productInfo || Object.keys(productInfo).length === 0) {
        return res.status(400).send({ error: "El cuerpo de la solicitud está vacío o mal formado." });
    }

    try {
        await manager.addProduct(productInfo);
        res.send({ status: "success" });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).send({ error: error.message });
    }
});

iniciar()



module.exports = router