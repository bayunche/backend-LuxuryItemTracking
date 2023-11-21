const express=require("express")
const app=express()
const cors = require('cors')
const path=require("path")

const jwtcheck=require("./utils/jwtCheck");
const bodyParser = require('body-parser');
const { connectDatabase, closeDatabaseConnection } = require("./data/UserDatabase");


 connectDatabase().then((dataBase)=>{
    closeDatabaseConnection(dataBase)
    console.log("DBTESTcomplete")
 })

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
// 
// app.use(jwtcheck)


app.post('/login',(req,res)=>{
    
})
const port=3101
app.listen(port,(error)=> {
    console.log("server is running on port "+port)
    if (error) {
        console.log(error)
    }
})