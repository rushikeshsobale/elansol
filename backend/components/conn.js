const mongooes = require("mongoose")

mongooes.connect("mongodb://127.0.0.1:27017/Register").then(()=>{
    console.log("connection is success.. ")
}).catch((error)=>{
console.log("database is not connected...")
})
