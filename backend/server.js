const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRouter = require('./routes/userRoute');
const cookieParser = require('cookie-parser');
dotenv.config()
const app = express();

//middleware
app.use(express())
app.use(cors());
app.use(express.json());
app.use('/api/user', userRouter);
app.use(cookieParser());

const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('MongoDB Connected'))
.then(() => app.listen(port, () => console.log(`Server running on port: ${port}`)))
