const express = require("express");

const Hospital = require("../models/Hospital");
const Medico = require("../models/Medico");
const Usuario = require("../models/Usuario");

const routes = express.Router();

routes.get("/coleccion/:tabla/:term", (req, res) => {
  const { term, tabla } = req.params;
  const regex = new RegExp(term, "i");

  var promesa;
  switch (tabla) {
    case "usuarios":
      promesa = buscarUsuarios(term, regex);
      break;
    case "medicos":
      promesa = buscarMedicos(term, regex);
      break;
    case "hospitales":
      promesa = buscarHospitales(term, regex);
      break;
    default:
      return res.status(400).json({
        ok: false,
        error: { message: "Colleaccion no valida" }
      });
  }

  promesa.then(data => {
    return res.status(200).json({
      ok: true,
      [tabla]: data
    });
  });
});

routes.get("/todo/:term", (req, res) => {
  const { term } = req.params;
  const regex = new RegExp(term, "i");

  Promise.all([
    buscarHospitales(term, regex),
    buscarMedicos(term, regex),
    buscarUsuarios(term, regex)
  ]).then(respuestas => {
    return res.status(200).json({
      ok: true,
      hospitales: respuestas[0],
      medicos: respuestas[1],
      usuarios: respuestas[2]
    });
  });
});

function buscarHospitales(term, regex) {
  return new Promise((resolve, reject) => {
    Hospital.find({ nombre: regex })
      .populate("usuario", "nombre email")
      .exec((err, hospitales) => {
        if (err) {
          reject("Error al cargar hospitales", err);
        } else {
          resolve(hospitales);
        }
      });
  });
}

function buscarMedicos(term, regex) {
  return new Promise((resolve, reject) => {
    Medico.find({ nombre: regex })
      .populate("usuario", "nombre email")
      .populate("hospital", "nombre")
      .exec((err, medicos) => {
        if (err) {
          reject("Error al cargar medicos", err);
        } else {
          resolve(medicos);
        }
      });
  });
}

function buscarUsuarios(term, regex) {
  return new Promise((resolve, reject) => {
    Usuario.find({}, "nombre email role")
      .or([{ nombre: regex }, { email: regex }])
      .exec((err, medicos) => {
        if (err) {
          reject("Error al cargar medicos", err);
        } else {
          resolve(medicos);
        }
      });
  });
}

module.exports = routes;
