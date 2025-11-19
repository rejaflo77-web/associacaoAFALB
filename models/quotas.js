const mongoose = require("mongoose");

const quotaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  ano: { type: Number, required: true },
  valor: { type: Number, required: true },
  pago: { type: Boolean, default: false },
  dataPagamento: { type: Date },
});

module.exports = mongoose.model("Quota", quotaSchema);
