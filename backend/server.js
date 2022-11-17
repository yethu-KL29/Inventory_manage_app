const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config()
const app = express();

const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('MongoDB Connected'))
.then(() => app.listen(port, () => console.log(`Server running on port: ${port}`)))