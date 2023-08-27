require("dotenv").config();
const express = require("express");

const app = express();

const cookieParser = require("cookie-parser");
const cors = require("cors");
const connect = require("./config/db");
const errorsMiddleware = require("./middlewares/error");
const { verifyToken } = require("./middlewares/auth");

app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(errorsMiddleware);
app.use(cors());

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const profileRoutes = require("./routes/profile_routes");

app.use("/auth", authRoutes);
app.use("/api", verifyToken);
app.use("/api/tasks", taskRoutes);
app.use("/api/profile", profileRoutes);

const port = process.env.port || 5000;

const start = async () => {
    try {
        await connect(process.env.MONGO_URL);
        app.listen(port, () => console.log(`server is running on port ${port}...`));
    } catch(err) {
          console.log(err.message);
        }
      }

start();