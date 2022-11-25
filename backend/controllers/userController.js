const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require("crypto")
const Token = require("../models/tokenModel")

const registerUser = async(req, res) => {

    const{ name , email ,password} =req.body
    const generateToken = (id) => {
        return jwt.sign({id}, process.env.JWT_SECRETKEY, {
            expiresIn: '30d'
        })
    }



    if(!name || !email || !password){
        return res.status(400).json({msg: "Please fill in all fields"})
    }
    let user;
    user = await User.findOne({email});
    if(user){
        return res.status(400).json({success: false, message: 'User already exists'})
    }
         try {
            user = new User({
                name,
                email,
                password
             })
            
            await user.save()

            const token= generateToken(user._id)
          
            res.cookie('token', token, {
                path :"/",
                expires:new Date(Date.now()+1000*30000),
                httpOnly:true,
                sameSite:'none' ,
                

            })


        } catch (error) {
            console.log(error)
        }
        if(!user){
            return res.status(500).json({message:"internal server error"})
        }
      
        return res.status(201).json({user})
}


const login=async(req,res,next)=>{
    const {email,password} = req.body;
    const generateToken = (id) => {
        return jwt.sign({id}, process.env.JWT_SECRETKEY, {
            expiresIn: '30d'
        })
    }
    if(!email || !password){
        return res.status(400).json({msg: "Please fill in all fields"})
    }
    let user;
    try{
    user = await User.findOne({email:email})
    }catch(err){
        console.log(err)
    }
    if(!user){
        return res.status(400).json({msg: "User does not exist"})
    }
    const isPasswordMatch = await bcrypt.compare(password,user.password)
    const token= generateToken(user._id)
          
            res.cookie('token', token, {
                path :"/",
                expires:new Date(Date.now()+1000*30000),
                httpOnly:true,
                sameSite:'none' ,
                

            })

    if(!isPasswordMatch){
        return res.status(400).json({msg: "Invalid PASSWORD"})
    }
    return res.status(200).json({msg:"login sucessfully",user})
}

const loginStatus = async (req, res) => {
    const cookie = req.headers.cookie;
        const token = cookie.split("=")[1];
    if (!token) {
      return res.json(false);
    }
    // Verify Token
    const verified = jwt.verify(token, process.env.JWT_SECRETKEY);
    if (verified) {
      return res.json(true);
    }
    return res.json(false);
  };
  
const logout = async(req,res,next)=>{
    res.cookie('token', "", {
        path :"/",
        expires:new Date(0),
        httpOnly:true,
        sameSite:'none' 
       

    })
    return res.status(200).json({msg:"logout sucessfully"})
}


const getUser=async(req,res,next)=>{    
    let user;
    try{
        user = await User.findById(req.user._id);
    }catch(err){
        console.log(err)
    }
    if(!user){
        return res.status(400).json({msg: "User does not exist"})
    }
    return res.status(200).json({user})
}


const updateUser = async(req,res,next)=>{
    const {name,email,password} = req.body;
    const id = req.user._id;
    let user;
    try{

    user = await User.findByIdAndUpdate(id,{
        name,
        email,
       

    });
    await user.save();
    }catch(err){
        console.log(err)
    }
    if(!user){
        return res.status(400).json({msg: "User does not exist"})
    }
    return res.status(200).json({user})

    
}
const changePass = async(req,res,next)=>{
    const {oldPassword,password} = req.body;
    const user = await User.findById(req.user._id);
    if(!user){
        return res.status(400).json({msg: "User does not exist"})
    }
    if(!oldPassword || !password){
        return res.status(400).json({msg: "Please fill in all fields"})
    }
    const isPasswordMatch = await bcrypt.compare(oldPassword,user.password)
    if(!isPasswordMatch){
        return res.status(400).json({msg: "Invalid PASSWORD"})
    }
    user.password = password;
    await user.save();
    return res.status(200).json({msg:"password changed sucessfully"})
}



const forgotPassword =async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
  
    if (!user) {
      res.status(404);
      throw new Error("User does not exist");
    }
  
    // Delete token if it exists in DB
    // let token = await Token.findOne({ userId: user._id });
    // if (token) {
    //   await token.deleteOne();
    // }
  
    // Create Reste Token
    let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
    console.log(resetToken);
  
    // Hash token before saving to DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    // Save Token to DB
    await new Token({
      userId: user._id,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * (60 * 1000), // Thirty minutes
    }).save();
}

    exports.registerUser = registerUser
    exports.login = login
    exports.logout = logout
    exports.getUser=getUser
    exports.loginStatus=loginStatus
    exports.updateUser=updateUser
    exports.changePass=changePass
    exports.forgotPassword=forgotPassword