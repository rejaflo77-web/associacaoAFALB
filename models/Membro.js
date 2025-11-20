const mongoose = require("mongoose");

const MembroSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  cargo: String,
  pais: String,
  telefone: { type: String, required: true },
  foto: String,
});

module.exports = mongoose.model("Membro", MembroSchema);

