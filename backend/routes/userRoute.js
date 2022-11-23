const express = require('express');
const { registerUser, login, logout, getUser } = require('../controllers/userController');
const protect = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register',registerUser);
router.post('/login',login);
router.post('/logout',logout);
router.get('/getuser',protect,getUser)

module.exports = router;