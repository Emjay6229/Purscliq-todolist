require("dotenv").config();
const app = require("./app");
const connect = require("./config/mongodb");

const port = process.env.port || 5000;

const start = async () => {
    try {
      await connect(process.env.MONGO_URL);
      app.listen(port, () => console.log(`server is running on port ${port}...`))
    } 
    catch(err) {
    console.log(err.message)
  }
}

start();