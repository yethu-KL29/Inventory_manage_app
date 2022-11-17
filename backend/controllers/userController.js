const User = require('../models/userModel')


const registerUser = async (req, res) => {
   
        const {name, email, password, phone} = req.body;
        const user = await User.findOne({email});
        if(user) return res.status(400).json({msg: 'The email already exists.'})
        if(password.length < 6) return res.status(400).json({msg: 'Password is at least 6 characters long.'})
       
        try {
        const user = new User({name, email, password, phone});
        await user.save();

        }catch(err){
            return res.status(500).json({msg: err.message})
        }

if(!user) return res.status(400).json({msg: 'Invalid credentials.'})
res.json({msg: 'Register Success!',user})
}
exports.registerUser = registerUser