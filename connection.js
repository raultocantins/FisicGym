const mongoose = require("mongoose");
const uri =
  "mongodb+srv://admin:3571592486@cluster0.ebc1x.mongodb.net/fisic?retryWrites=true&w=majority";
var connection = mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
connection
  .then((_) => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log('problema na conexão')
    console.log(err);
  });

module.exports = connection;
