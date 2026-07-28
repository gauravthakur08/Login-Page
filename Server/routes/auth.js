const express = require("express")
const bcrypt = require("bcryptjs")
 const jwt = require("jsonwebtoken")
 const User = require("../models/User")


 const router = express.Router()

 router.post("/register",async (req,res)=>{
    try{
       const{name,email,password}=req.body
       const existingUser = await User.findOne({email});
       if(existingUser){
        return res.status(400).json({message:"User already existed"})
       }
       const hashpassword = await bcrypt.hash(password,10)
       const newUser = await User.create({
        name,
        email,
        password:hashpassword,
       })
       const token = jwt.sign(
       { id: newUser._id},
       process.env.JWT_SECRET,
    {expiresIn:'10d'},
       )
       res.status(201).json({
        token,
        user:{
        id:newUser._id,
        name:newUser.name,
        email:newUser.email,
 }
       })

       
    }catch(err){
        res.status(501).json({message:err.message})
    }

 });
 //Login//
 router.post("/login",async (req,res)=>{
    try{
       const{email,password}=req.body
       const user= await User.findOne({email});
       if(!user){
        return res.status(400).json({message:"Inavlid Creditentials"})
       }
       const isMatched = await bcrypt.compare(password,user.password)
       if(!isMatched){
         res.status(400).json({message:"INVALID CREDITENTIALS"})
       }
      
       const token = jwt.sign(
       { id: user._id},
       process.env.JWT_SECRET,
    {expiresIn:'10d'},
       )
       res.status(200).json({
        token,
        user:{
        id:user._id,
        name:user.name,
        email:user.email,
 }
       })
    }catch(err){
        res.status(501).json({message:err.message})
    }

 });
 
 module.exports = router;

 