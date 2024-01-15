const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { verifyToken } = require("./middlewares/auth");

const authRoutes = require("./routes/auth-routes");
const taskRoutes = require("./routes/task-routes");
const profileRoutes = require("./routes/profile-routes");
// const teamRoutes = require();
// const projectRoutes = require();

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use(cookieParser());

app.use(cors());

// app.use(
//   cors({
//     origin: [
//       "https://task-management-nu-nine.vercel.app", 
//       "http://localhost:5173", 
//       "http://localhost:5174"
//     ],
//     methods: "GET, HEAD, PUT, POST, PATCH, DELETE",
//     credentials: true
//   })
// );

app.use("/auth", authRoutes);
app.use("/api", verifyToken);
app.use("/api/tasks", taskRoutes);
app.use("/api/profile", profileRoutes);

module.exports = app;