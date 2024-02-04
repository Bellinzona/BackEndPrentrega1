const { Router } = require("express");
const router = Router()
const CarritoManager = require("../cartManager")


const manager = new CarritoManager(__dirname + "/../files/carts.json")

const productpath = __dirname + "/../files/products.json"

router.get("/", async (req,res) => {
    let carrito = await manager.getItems()

    console.log(carrito)
    

    res.send(carrito)
})

router.get("/:iid", async (req, res) => {
    const id = req.params.iid
    const item = await manager.getItem(id)

    if (!item){
        res.status(400).send({message:"cualuier cosa"})
    }else{
        res.send({item})
    }
})

router.post("/:cid/product/:iid", async (req, res) => {

    try{
        await manager.addProductinCarrito(req.params.cid, req.params.iid,productpath);
        res.send({ status: "success" });

    } catch {
        res.status(404).send({message:"error bro"})
    }
    
});


router.post("/", async (req, res) => {
    await manager.addItem(req.body);
    res.send({ status: "success" });
});



module.exports = router