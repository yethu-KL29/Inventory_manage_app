const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

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
const logout = async(req,res,next)=>{
    res.cookie('token', "", {
        path :"/",
        expires:new Date(0),
        httpOnly:true,
        sameSite:'none' 
       

    })
    return res.status(200).json({msg:"logout sucessfully"})
}

    exports.registerUser = registerUser
    exports.login = login
    exports.logout = logout