const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const rolesValidos = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} no es un rol permitido"
};

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: [true, "El nombre es necesario"] },
  email: {
    type: String,
    unique: true,
    required: [true, "El correo es necesario"]
  },
  password: { type: String, required: [true, "La contraseña es necesario"] },
  img: { type: String, required: false },
  role: {
    type: String,
    required: true,
    default: "USER_ROLE",
    enum: rolesValidos
  }
});

usuarioSchema.plugin(uniqueValidator, {
  message: "El {PATH} ya está registrado"
});

module.exports = mongoose.model("Usuario", usuarioSchema);
