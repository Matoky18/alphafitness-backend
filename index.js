const express = require("express");
const app = express ();
const pool = require("./db");
app.use(express.json());

app.get("/products/:id", async (req,res)=>{
    const id = req.params.id;

    const result =  await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    res.json(result.rows[0]);

})
app.post("/products",async(req,res)=>{
    const {name, price , stock} = req.body;
    console.log(name, price, stock);
    console.log("stock avant SQL :", stock);


    if ( typeof stock !== "number" || stock < 0) {
        return res.status(400).json({error: "Invalid stock value"});
    }
    
    if (typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({error: "Invalid product name"});
    }

    if (typeof price !== "number" || price < 0) {
        return res.status(400).json({error: "Invalid price value"});
    }


    try {
        const result = await pool.query("INSERT INTO products (name, price, stock) VALUES ($1, $2, $3) RETURNING *", [name, price, stock]);
        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(400).json({error: "Internal server error"});
    }  
    

})

app.put("/products/:id", async (req,res)=>{
    const id = req.params.id;
    const {name, price, stock} = req.body;


    try {
        const resultat = await pool.query("UPDATE products SET name = $1, price = $2, stock = $3 WHERE id = $4 RETURNING *", [name, price, stock, id]);
        res.json(resultat.rows[0]);
    } catch (error) {
        console.error(error);
       res.status(500).json({
        error: "Internal server error"
        });
    }

})

app.delete("/products/:id", async (req,res)=>{
    const id = req.params.id;

    try {
        const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({
            message: "Product deleted successfully",
            deletedProduct: result.rows[0]
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});

