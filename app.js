const express = require("express");
const mongoose = require("mongoose");

const app = express();

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

// Rutas
app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    meñnsaje: "Peticion realizada correctamente"
  });
});

app.listen(3333, () => {
  console.log("Server Express 3333: \x1b[32m%s\x1b[0m", "online");
});
