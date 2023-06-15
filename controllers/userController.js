// import model in userController.js file
const users = require('../models/userSchema')

//import jsonwebtoken
const jwt =require ('jsonwebtoken')

// define and export logic to resolve different http client request

// register

exports.register = async (req,res)=>{
  //register  logic 
  console.log(req.body);
  //get data send by front end 
  const {username,acno,password }=req.body
  //destructing method
  if(!username || !acno ||!password){
  res.status(403).json("All inputs are required!!!")
}
//check user is an exist user
try{
const preuser= await users.findOne({acno})
if(preuser){
  res.status(406).json("user already exits!!!")
}
else{
  //add user to do
  const newuser =new users({
    username,
    password,
    acno,
    balance:5000,
    transaction:[]
  }) 
  //to save newuser in mongodb
  await newuser.save()
  res.status(200).json(newuser)
}
}
catch(error){
  res.status(401).json(error)
}
}

//login
exports.login=async(req,res)=>{
  //get req body
  const {acno,password} = req.body  
  try{

//check acno n pswd is in db
const preuser =await users.findOne({acno,password})

//check preuser or not
if(preuser){

  //generate token using jwt
  const token=jwt.sign({
    loginAcno:acno
  },"supersecretkey12345")
  //send to client
  
  res.status(200).json({preuser,token})
}
else{
  res.status(404).json("invalid account number/password")
}
  }
  catch(error){
    res.status(401).json(error)
  }
}

//get balance
exports.getBalance = async (req,res)=>{

  let acno = req.params.acno

  console.log(acno);
  try{
    const preuser =  await users.findOne({acno})
    res.status(200).json(preuser.balance)

  }
  catch(error){
    res.status(404).json("Invalid Account Number")
  }
}

//transfer

exports.transfer=async(req,res)=>{
  console.log("inside transfer logic");
  //logic
  //1.get body from req, creditAcno , amt,pswd
  const {creditAcno,creditAmount,pswd}=req.body
  let amt=Number(creditAmount)
  const {debitAcno}=req
  console.log(debitAcno);
try{
//2.check debit acno and password is available in mongodb
const debitUser = await users.findOne({acno:debitAcno,password:pswd})
console.log(debitUser);
// 3.get credit acno details from mongodb
const creditUser =await users.findOne({acno:creditAcno})  
console.log(creditUser);
if(debitAcno!=creditAcno){
  if(debitUser && creditUser){
    //check sufficient balance available for debitUser
    if(debitUser.balance>=creditAmount){
      //perform transfer
      //debit creditAmount from debit user
      debitUser.balance-=amt
      //add debit transaction to debit user
      debitUser.transaction.push({
        transaction_type:"DEBIT",amount:creditAmount,fromAcno:debitAcno,toAcno:creditAcno
      })
      //save debit user in mongodb
      await debitUser.save()
      //credit creditAmount to creditUser
      creditUser.balance+=amt
      //add credit transaction to debitUser
      creditUser.transaction.push({
        transaction_type:"CREDIT",amount:creditAmount,fromAcno:debitAcno,toAcno:creditAcno
      })
      //save credit user in mongodb
      await creditUser.save()
      res.status(200).json("Fund transfer successfully completed...")
    }
    else{
      //insufficient
      res.status(406).json("insufficient balance!!")
    }
  }
  else{
    res.status(406).json("invalid credit/debit details!!")
  }
}else{
  res.status(406).json("operation denied!!selftransfer not allowed")
}

}
catch(error){
  res.status(401).json(error)
//res.send("transfer request received")
}
}

//get transaction 
exports.ministatement= async (req,res)=>{
  //1. get acno from req.debitAcno
  let acno = req.debitAcno
  try{
    //2.check acno in mongodb
    const preuser = await users.findOne({acno})
    // console.log(preuser);
    res.status(200).json(preuser.transaction)
  }
  catch(error){
    res.status(401).json(error)
 }
}

//deleteMyAcno
exports.deleteMyAcno = async (req,res)=>{
  //1.get acno from req
  let acno = req.debitAcno

  //remove acno from db
  try{
    await users.deleteOne({acno})
    res.status(200).json("remove successfully")
  }
  catch(error){
   res.status(401).json(error)
  }
}