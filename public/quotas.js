const mongoose = require("mongoose");

const QuotaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  ano: { type: Number, required: true },
  valor: { type: Number, required: true },
});

module.exports = mongoose.model("Quota", QuotaSchema);
