const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {type:String, unique:true},
    passwordHash: String,
}, {timestamps:true})

const userModel = mongoose.model('User', userSchema)

module.exports = userModel