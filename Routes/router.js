//import express
const  express = require('express')

//import middleware
const middleware =require('../Middleware/routerSpecific')

//create routes, using express.Router() class, object
const Router = new express.Router()

//import controller
const userController = require('../controllers/userController')
 
//define routes to resolve http request

//register rqst
Router.post('/employee/register',userController.register)


//login
Router.post('/employee/login',userController.login)

// balance get request
Router.get('/user/balance/:acno',middleware.logMiddleware,userController.getBalance)

//fund transfer
Router.post('/user/transfer',middleware.logMiddleware,userController.transfer)

//ministatement
Router.get('/user/ministatement',middleware.logMiddleware,userController.ministatement)

//deleteaccount
Router.delete('/user/delete',middleware.logMiddleware,userController.deleteMyAcno)


//export router
module.exports = Router

