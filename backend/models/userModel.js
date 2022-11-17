const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({

    name: {
        type: String,
        required: [true, 'Please enter a name'],
    },
    email: {
        type: String,
        required:[true, 'Please enter an email'],
        unique: true,
        trim : true,
        // match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 
        // 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [5, 'Minimum password length is 6 characters']
    },
    photo: {
        type: String,
        default: 'https://res.cloudinary.com/dxqjyqz8f/image/upload/v1621234567/avatars/default-avatar.png'
    },
    phone: {
        type: String,
       
    },
    bio: {
        type: String,
        default: 'Hey there! I am using Social Media App.'
    },
     


}, {timestamps: true})

module.exports = mongoose.model('User', userSchema)