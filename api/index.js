const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const User = require('./models/login')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const bcrypt = require('bcrypt')
const ws = require('ws')
dotenv.config()



const app = express()
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))

app.use(express.json())
app.use(cookieParser())

const mongourl = process.env.MONGODB_URI
const jwtSecret = process.env.SECRET



mongoose.connect(mongourl, {
  useUnifiedTopology: true, // For Mongoose 5 only. Remove for Mongoose 6+
  serverSelectionTimeoutMS: 1000, // Defaults to 30000 (30 seconds)
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));


app.get('/test', async (req, res) => {
    try {
      await User.deleteMany({});
      res.send('Database cleared!');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error clearing database');
    }
  });

app.get('/profile', async(req, res) => {
    const token = req.cookies?.token
    if (token) {
        try {
            const userData = jwt.verify(token, jwtSecret)
            res.json(userData)
        } catch (error) {
            throw error
        }
    } else {
        res.status(403).json('no token')
    }
})
app.post('/register', async(req, res) => {
    const { username, password } = req.body;
    let forToken = null;
    
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    try {
      const createdUser = await User.create({ username, passwordHash });
      forToken = {
        userId: createdUser._id,
        username: createdUser.username,
    };
        const generatedToken = await jwt.sign(forToken, jwtSecret);
        res.cookie('token', generatedToken, {sameSite:'none', secure:true}).status(201).json({
            id: createdUser._id,
            username: createdUser.username
        })
    } catch (error) {
      if (error.code === 11000) { // 11000 is the error code for duplicate key in MongoDB
        return res.status(400).json({ message: 'Username already exists' });
      }
      throw error; // If it's not a duplicate username error, re-throw the error
    }
})

app.post('/login', async(req, res) => {
    const {username, password} = req.body
    try {
    const user = await User.findOne({username:username})
    if(!user) {
        return res.status(404).json({error: 'username not found'})
    }

    const correctPassword = await bcrypt.compare( password, user.passwordHash)
    if(!correctPassword) {
        return res.status(401).json({error: "wrong password"})
    }
    
    forToken = {
        userId: user._id,
        username: user.username,
    };
        const generatedToken = await jwt.sign(forToken, jwtSecret);
        res.cookie('token', generatedToken, {sameSite:'none', secure:true}).status(201).json({
            id: user._id,
            username: user.username
        })
    } catch (error) {
      if (error.code === 11000) { // 11000 is the error code for duplicate key in MongoDB
        return res.status(400).json({ message: 'Username already exists' });
      }
      
    }
})

const server = app.listen(3001, ()=> {
    console.log(`app running on port 3001`);
})

const wss = new ws.WebSocketServer({server})

wss.on('connection', (connection) => {
    console.log("connection")
    connection.send('hello mutherfucker')
} )