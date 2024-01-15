require("dotenv").config();
const app = require("./app");
const connect = require("./config/mongodb");

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connect(process.env.MONGO_URL);
    app.listen(PORT, () => console.log(`server is running on PORT ${PORT}...`))
  } 
  catch(err) {
    console.log(err.message)
  }
}

start();