const express = require("express");

const loginRoutes = require("./login-routes");
const usuarioRoutes = require("./usuario-routes");
const hospitalRoutes = require("./hospital-routes");
const medicoRoutes = require("./medico-routes");

const routes = express.Router();

routes.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    mensaje: "Peticion realizada correctamente"
  });
});

routes.use("/login", loginRoutes);
routes.use("/usuario", usuarioRoutes);
routes.use("/hospital", hospitalRoutes);
routes.use("/medico", medicoRoutes);

module.exports = routes;
