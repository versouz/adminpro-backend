const express = require("express");
const bcrypt = require("bcryptjs");

const mdAutenticacion = require("../middlewares/autenticacion");

const Usuario = require("../models/Usuario");

const routes = express.Router();

routes.get("/", (req, res) => {
  Usuario.find({}, "nombre email img role").exec((err, usuarios) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error cargando usuario",
        errors: err
      });
    }

    return res.status(200).json({
      ok: true,
      usuarios
    });
  });
});

routes.put("/:id", mdAutenticacion.verificarToken, (req, res) => {
  const { id } = req.params;
  const { nombre, email, role } = req.body;

  Usuario.findById(id, (err, usuario) => {
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
        mensaje: `El usuario con el id ${id} no existe`,
        errors: {
          message: "El usuario no existe"
        }
      });
    }

    usuario.nombre = nombre;
    usuario.email = email;
    usuario.role = role;

    usuario.save((err, usuarioGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar usuario",
          errors: err
        });
      }

      return res.status(201).json({
        ok: true,
        usuarioGuardado
      });
    });
  });
});

routes.post("/", mdAutenticacion.verificarToken, (req, res) => {
  const usuario = new Usuario({
    ...req.body,
    password: bcrypt.hashSync(req.body.password, 10)
  });

  usuario.save((err, usuarioGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear usuario",
        errors: err
      });
    }

    return res.status(201).json({
      ok: true,
      usuario: usuarioGuardado
    });
  });
});

routes.delete("/:id", mdAutenticacion.verificarToken, (req, res) => {
  const { id } = req.params;

  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar usuario",
        errors: err
      });
    }

    if (!usuarioBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: `El usuario con el id ${id} no existe`,
        errors: {
          message: "El usuario no existe"
        }
      });
    }

    return res.status(200).json({
      ok: true,
      usuario: usuarioBorrado
    });
  });
});

module.exports = routes;
