const mongoose = require("mongoose");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const connect = async(url) => {
    try {
        await mongoose.connect(url, options);
        console.log("connected to MongoDB!");
    } catch (err) {
      console.log(err.message);
    }
  }

module.exports = connect;