const express = require("express");

const mdAutenticacion = require("../middlewares/autenticacion");

const Medico = require("../models/Medico");

const routes = express.Router();

routes.get("/", (req, res) => {
  const { desde = 0 } = req.query;

  Medico.find({})
    .skip(parseInt(desde))
    .limit(5)
    .populate("usuario", "nombre email")
    .populate("hospital", "nombre")
    .exec((err, medicos) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error cargando medicos",
          errors: err
        });
      }

      Medico.count({}, (err, conteo) => {
        return res.status(200).json({
          ok: true,
          medicos,
          total: conteo
        });
      });
    });
});

routes.post("/", mdAutenticacion.verificarToken, (req, res) => {
  const medico = new Medico({
    ...req.body,
    usuario: req.usuario._id
  });

  medico.save((err, medicoGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear el Medico",
        errors: err
      });
    }

    return res.status(201).json({
      ok: true,
      medico: medicoGuardado
    });
  });
});

routes.put("/:id", mdAutenticacion.verificarToken, (req, res) => {
  const { id } = req.params;
  const { nombre, hospital } = req.body;

  Medico.findById(id, (err, medico) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar un medico",
        errors: err
      });
    }

    if (!medico) {
      return res.status(500).json({
        ok: false,
        mensaje: "medico no encontrado",
        errors: { message: "El medico no ha sido encontrado" }
      });
    }

    medico.nombre = nombre;
    medico.hospital = hospital;
    medico.usuario = req.usuario._id;

    medico.save((err, medicoGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el medico",
          errors: err
        });
      }

      return res.status(200).json({
        ok: true,
        medico: medicoGuardado
      });
    });
  });
});

routes.delete("/:id", mdAutenticacion.verificarToken, (req, res) => {
  const { id } = req.params;

  Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar un Medico",
        errors: err
      });
    }

    if (!medicoBorrado) {
      return res.status(500).json({
        ok: false,
        mensaje: "Medico no encontrado",
        errors: { message: "El Medico no ha sido encontrado" }
      });
    }

    return res.status(200).json({
      ok: true,
      medico: medicoBorrado
    });
  });
});

module.exports = routes;
