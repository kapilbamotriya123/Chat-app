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

wss.on('connection', async (connection, req) => {
  // we are reading username and id from the cookie for this connection
  const cookies = req.headers.cookie;
  if (cookies) {
      const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='));
      //extracting the user information from cookie and storing it to connection
      if (tokenCookieString) {
          const token = tokenCookieString.split('=')[1];
          if (token) {
              try {
                  const { username, userId } = await jwt.verify(token, jwtSecret);
                  connection.userId = userId;
                  connection.username = username;
              } catch (error) {
                  throw error;
              }
          }
      }
  }

  // when someone sends a message
  connection.on('message', (message) => {
      try {
          const messageData = JSON.parse(message.toString());
          const {recipient, text} = messageData
          if(recipient && text) {
            [...wss.clients]
            .filter(client => client.username === recipient)
            .forEach(client => client.send(JSON.stringify({text})));
            /* this is important as we are not finding , we are filtering which at first glance might look off as there
            is only one user of username but clients are user so a single user can be
            connected on multiple devices so there may be multiple clients and we want to send data to everyone of them */
          }

      } catch (error) {
          console.error('Error parsing message:', error);
      }
  });

  // notify the people about who is online
  [...wss.clients].forEach(client => {
      client.send(JSON.stringify({
          online: [...wss.clients].map(c => ({ userId: c.userId, username: c.username }))
      }));
  });
});
