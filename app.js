require("dotenv").config();
require("express-async-errors")
const express = require("express")
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { verifyToken } = require("./middlewares/auth")

const app = express()

const connect = require("./config/db")
const errorsMiddleware = require("./middlewares/error")

// Mount Middleware
app.use(express.static("./public"))
app.use(express.json())
app.use(express.urlencoded( { extended: false } ))
app.use(cookieParser());
app.use(errorsMiddleware)
app.use(cors());

const authRoutes = require("./routes/authRoutes")
const taskRoutes = require("./routes/taskRoutes")

// ROUTES
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