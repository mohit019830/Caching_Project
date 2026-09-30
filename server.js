const fs=require('fs')
const path=require('path')
const fsPromise=require('fs/promises')
const express=require('express')
const { resolve } = require('dns')

const app=express()
const filePath=path.join(__dirname,"db.json")

const delayReadData=async()=>{
    await new Promise((res,rej)=>{
        setTimeout(res,5000)
    })
    return await readData()
}

async function readData(){
    let data=await fsPromise.readFile(filePath,"utf-8")
    return JSON.parse(data)
}

app.get("/products",async (req,res)=>{
    try {
        let products=await delayReadData()
        res.send(products)
    }catch(err){    
        res.send(err)
    }

})
app.get("/products/:id",async (req,res)=>{
    try{
        let id=Number(req.params.id)
        let products=await delayReadData()
        let data=products.find(product=>product.id===id)
        res.json(data)
        
    }catch(err){
        res.send(err)
    }

})

app.listen(3000)
