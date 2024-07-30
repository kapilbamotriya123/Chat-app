const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const User = require('./models/login')
const jwt = require('jsonwebtoken')
const cors = require('cors')
dotenv.config()



const app = express()
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))

app.use(express.json())

const mongourl = process.env.MONGODB_URI
const jwtSecret = process.env.SECRET

mongoose.connect(mongourl).then(res => {
    console.log(`connected to mongo db url`);
})

app.get('/test', async(req, res) => {
    res.send('hello world')
})

app.post('/register', async(req, res) => {
    const { username, password } = req.body;
    let forToken = null;
    
    try {
      const createdUser = await User.create({ username, password });
      forToken = {
        userId: createdUser._id,
        username: createdUser.username,
    };
        const generatedToken = await jwt.sign(forToken, jwtSecret);
        res.cookie('token', generatedToken).status(201).json({
            id: createdUser._id
        })
    } catch (error) {
      if (error.code === 11000) { // 11000 is the error code for duplicate key in MongoDB
        return res.status(400).json({ message: 'Username already exists' });
      }
      throw error; // If it's not a duplicate username error, re-throw the error
    }


})

app.listen(3001, res=> {
    console.log(`app running on port 3001`);
})