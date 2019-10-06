const express = require("express");

const mdAutenticacion = require("../middlewares/autenticacion");

const Hospital = require("../models/Hospital");

const routes = express.Router();

routes.get("/", (req, res) => {
  Hospital.find({}, (err, hospitales) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error cargando hospitales",
        errors: err
      });
    }

    return res.status(200).json({ ok: true, hospitales });
  });
});

routes.post("/", mdAutenticacion.verificarToken, (req, res) => {
  const hospital = new Hospital({
    ...req.body,
    usuario: req.usuario._id
  });

  hospital.save((err, hospitalGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear el hospital",
        errors: err
      });
    }

    return res.status(201).json({
      ok: true,
      hospital: hospitalGuardado
    });
  });
});

routes.put("/:id", mdAutenticacion.verificarToken, (req, res) => {
  const { id } = req.params;
  const { nombre, img } = req.body;

  Hospital.findById(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar un hospital",
        errors: err
      });
    }

    if (!hospital) {
      return res.status(500).json({
        ok: false,
        mensaje: "Hospital no encontrado",
        errors: { message: "El hospital no ha sido encontrado" }
      });
    }

    hospital.nombre = nombre;
    hospital.img = img;

    hospital.save((err, hospitalGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el hospital",
          errors: err
        });
      }

      return res.status(200).json({
        ok: true,
        hospital: hospitalGuardado
      });
    });
  });
});

routes.delete("/:id", mdAutenticacion.verificarToken, (req, res) => {
  const { id } = req.params;

  Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar un hospital",
        errors: err
      });
    }

    if (!hospitalBorrado) {
      return res.status(500).json({
        ok: false,
        mensaje: "Hospital no encontrado",
        errors: { message: "El hospital no ha sido encontrado" }
      });
    }

    return res.status(200).json({
      ok: true,
      hospital: hospitalBorrado
    });
  });
});

module.exports = routes;
