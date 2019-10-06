const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require("./routes/app-routes");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

mongoose.connect(
  "mongodb+srv://everton:everton@omnistack2019-9-9wfli.mongodb.net/hospitalDb?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err, res) => {
    if (err) throw err;
    console.log("Server MongoDB: \x1b[32m%s\x1b[0m", "online");
  }
);

app.use(routes);

app.listen(3333, () => {
  console.log("Server Express 3333: \x1b[32m%s\x1b[0m", "online");
});
