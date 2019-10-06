const express = require("express");

const loginRoutes = require("./login-routes");
const usuarioRoutes = require("./usuario-routes");

const routes = express.Router();

routes.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    mensaje: "Peticion realizada correctamente"
  });
});

routes.use("/login", loginRoutes);
routes.use("/usuario", usuarioRoutes);

module.exports = routes;
