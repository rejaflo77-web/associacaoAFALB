 
 const mongoose = require("mongoose");

const membroSchema = new mongoose.Schema({
  nome: String,
  email: String,
  cargo: String,
  pais: String,
  telefone: String,
  foto: String,
});

module.exports = mongoose.model("Membro", membroSchema);

