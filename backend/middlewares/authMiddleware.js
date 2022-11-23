const User = require("../models/userModel");
const jwt=require("jsonwebtoken");

const protect = async (req, res, next) => {
    try {
        const cookie = req.headers.cookie;
        const token = cookie.split("=")[1];
        if (!token) {
          res.status(401).json({ message: "Not authorized" });
         
        }
    
        // Verify Token
        const verified = jwt.verify(token, process.env.JWT_SECRETKEY);
        // Get user id from token
        const user = await User.findById(verified.id).select("-password");
    
        if (!user) {
          res.status(401).json({ success: false, message: "User not found" });
         
        }
        req.user = user;
        next();
      } catch (error) {
        res.status(401).json({ success: false, message: "Not authorized 2" });
        
      }

}
module.exports = protect;