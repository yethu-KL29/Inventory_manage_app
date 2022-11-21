const User = require('../models/userModel')


const registerUser = async(req, res) => {
   
    const{ name , email ,password} =req.body
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
        } catch (error) {
            console.log(error)
        }
        if(!user){
            return res.status(500).json({message:"internal server error"})
        }
        return res.status(201).json({user})
}
exports.registerUser = registerUser