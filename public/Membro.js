/*const mongoose = require("mongoose");

const MembroSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  cargo: String,
  pais: String,
  telefone: String,
  foto: String,
});

module.exports = mongoose.model("Membro", MembroSchema);*/


const mongoose = require("mongoose");

const membroSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  cargo: String,
  pais: { type: String, required: true },
  telefone: { type: String, required: true },
  foto: { type: String, required: true },
});

module.exports = mongoose.model("Membro", membroSchema);

