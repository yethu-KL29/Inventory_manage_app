const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
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
            console.log(token)
        } catch (error) {
            console.log(error)
        }
        if(!user){
            return res.status(500).json({message:"internal server error"})
        }
      
        return res.status(201).json({user})
}
exports.registerUser = registerUser