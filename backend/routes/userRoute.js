const express = require('express');
const { registerUser, login, logout, getUser, loginStatus,forgotPassword ,updateUser,changePass} = require('../controllers/userController');
const protect = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register',registerUser);
router.post('/login',login);
router.post('/logout',logout);
router.get('/getuser',protect,getUser)
router.get("/loginstatus",loginStatus);
router.put('/update',protect,updateUser)
router.patch('/changepassword',protect,changePass)
router.post("/forgotpassword",forgotPassword)

module.exports = router;