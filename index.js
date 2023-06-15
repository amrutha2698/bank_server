//import
//config:loads .env file contents into process now
require('dotenv').config();

//im[ort express
const express =require('express')

//import cors
const cors = require('cors')

// import db
require('./db/connection')


//import appMiddleware
const middleware =require('./middleware/appMiddleware')

//import router
const Router=require('./Routes/router')


//create express server
const server = express()

//setup port number for server
const PORT = 3000 || process.env.PORT

//use cors,json parser in sever app
server.use(cors())
server.use(express.json())
server.use(middleware.appMiddleware)

//use router in server app
server.use(Router)

//to resolve http request using express server
server.get('/',(req,res)=>{
    res.send(`<h1>Bank server started!!</h1>`)
})

server.post('/',(req,res)=>{
    res.send("post method")
})

//delete request
server.delete('/',(req,res)=>{
    res.send("delete method")
})
//run the server app in a specified port
server.listen(PORT,()=>{
    console.log(`bank server started at port number ${PORT}`);
})
