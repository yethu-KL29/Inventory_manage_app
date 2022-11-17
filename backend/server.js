const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRouter = require('./routes/userRoute');

dotenv.config()
const app = express();

//middleware
app.use(express())
app.use(cors());
app.use(express.json());
app.use('/api/users', userRouter);

app.get('/', (req, res) => {
    res.send('Hello World!')
})
const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('MongoDB Connected'))
.then(() => app.listen(port, () => console.log(`Server running on port: ${port}`)))