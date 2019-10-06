const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SEED } = require("../config/config");

const Usuario = require("../models/Usuario");

const routes = express.Router();

routes.post("/", (req, res) => {
  const { email, password } = req.body;

  Usuario.findOne({ email }, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar usuario",
        errors: err
      });
    }

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: `El usuario con el id ${email} no existe`,
        errors: {
          message: "El usuario no existe"
        }
      });
    }

    if (!bcrypt.compareSync(password, usuario.password)) {
      return res.status(400).json({
        ok: false,
        mensaje: `Credenciales incorrectas`,
        errors: {
          message: "Credenciales incorrectas"
        }
      });
    }

    usuario.password = ":)";
    const token = jwt.sign({ usuario }, SEED, {
      expiresIn: 14400
    });

    return res.status(200).json({
      ok: true,
      usuario,
      token,
      id: usuario._id
    });
  });
});

module.exports = routes;
