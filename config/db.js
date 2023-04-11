const mongoose = require("mongoose")

const connect = async (url) => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
          }
        )
        console.log("connected to MongoDB!");
    } catch (err) {
            console.log(err.message);
          }
        }

module.exports = connect