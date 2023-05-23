import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import crypto from 'crypto'
import bcrypt from 'bcrypt'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-authorization"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


const port = process.env.PORT || 8080
const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.get('/', (req, res) => {
  res.send('Hello Technigo!')
})

const { Schema } = mongoose

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString("hex")
  }
})

const User = mongoose.model("User", UserSchema)

app.post('/signup', async (req, res) => {
  const { username, password } = req.body
  try {
    const salt = bcrypt.genSaltSync()
    const newUser = await new User({
      username: username,
      password: bcrypt.hashSync(password, salt)
    }).save()
    res.status(201).json({
      success: true,
      response: {
        username: newUser.username,
        id: newUser._id,
        accessToken: newUser.accessToken
      }
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      response: {
        error: error
      }
    })
  }
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await User.findOne({ username: username })
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(201).json({
        success: true,
        response: {
          username: user.username,
          id: user._id,
          accessToken: user.accessToken
        }
      })
    } else {
      res.status(400).json({
        success: false,
        response: "Credentials do not match"
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error
    })
  }
})

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  },
  user: {
    type: String,
    require: true
  }
})

const Thought = mongoose.model("Thought", ThoughtSchema)

const authenticateUser = async (req, res, next) => {
  const accessToken = req.header("Authorization")
  try {
    const user = await User.findOne({ accessToken: accessToken })
    if (user) {
      next()
    } else {
      res.status(400).json({
        success: false,
        response: error
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error
    })
  }
}

app.get("/thoughts", authenticateUser)
app.get('/thoughts', async (rq, res) => {
  const thoughts = await Thought.find({})
  res.status(200).json({
    success: true,
    response: thoughts
  })
})

app.post("/thoughts", authenticateUser)
app.post('/thoughts', async (rq, res) => {
  const { message } = req.body
  const accessToken = req.header("Authorization")
  const user = await User.findOne({ accessToken: accessToken })
  const thoughts = await new Thought({ message: message, user: user._id }).save()
  res.status(200).json({
    success: true,
    response: thoughts
  })
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
