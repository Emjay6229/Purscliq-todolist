require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connect = require("./config/db");
const { verifyToken } = require("./middlewares/auth");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const profileRoutes = require("./routes/profile_routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors({
  origin: ["https://task-management-nu-nine.vercel.app", "http://localhost:5173"],
  methods: "GET, HEAD, PUT, POST, PATCH, DELETE",
  credentials: true
  }));

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