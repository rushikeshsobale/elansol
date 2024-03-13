const express=require("express")
const app=express()
const router =require("./components/Rout")
require("./components/conn")
app.use(express.json())
const cors=require("cors")
app.use(cors())
const port=3050

app.use(router)

app.listen(port,(error)=>{
console.log("port is successfully Running "+port)
})