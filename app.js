require("dotenv").config();
const express = require("express")
const session = require("express-session");
const app = express()
const cookieParser = require("cookie-parser");
require("express-async-errors");
const cors = require("cors");
const connect = require("./config/db")
const errorsMiddleware = require("./middlewares/error")
const { verifyToken } = require("./middlewares/auth")

// Mount Middleware
app.use(express.static("./public"))
app.use(express.json())
app.use(express.urlencoded( { extended: false } ))
app.use(cookieParser());
app.use(errorsMiddleware)
app.use(cors());

// Start Session
app.use( session( {
    secret: process.env.secret_key,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 120 * 1000,
        httpOnly: true
      }
    }
  )
)

// ROUTES
const authRoutes = require("./routes/authRoutes")
const taskRoutes = require("./routes/taskRoutes")

// SET ROUTES
app.use("/user", authRoutes)
app.use("/user/signin/tasks", verifyToken, taskRoutes)

const port = process.env.port || 5000

// Start server
const start = async () => {
    try {
        connect(process.env.MONGO_URL)

        app.listen(port, () => {
        console.log(`server is running on port ${port}...`)
      })
    } catch(err) {
          console.log(err.message)
        }
      }

start();