require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Pasta de imagens
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado com sucesso!"))
  .catch(err => console.error("❌ Erro no MongoDB:", err));

// Modelo
const MembroSchema = new mongoose.Schema({
  nome: String,
  email: String,
  cargo: String,
  pais: String,
  telefone: String,
  foto: String
}, { timestamps: true });

const Membro = mongoose.model("Membro", MembroSchema);

// Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ✅ CRIAR MEMBRO
app.post("/api/membros", upload.single("foto"), async (req, res) => {
  try {
    const novo = new Membro({
      nome: req.body.nome,
      email: req.body.email,
      cargo: req.body.cargo,
      pais: req.body.pais,
      telefone: req.body.telefone,
      foto: req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : null
    });

    await novo.save();
    res.json(novo);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao criar membro" });
  }
});

// ✅ LISTAR MEMBROS
app.get("/api/membros", async (req, res) => {
  const membros = await Membro.find().sort({ createdAt: -1 });
  res.json(membros);
});

// ✅ EDITAR MEMBRO
app.put("/api/membros/:id", async (req, res) => {
  await Membro.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Membro atualizado" });
});

// ✅ APAGAR MEMBRO
app.delete("/api/membros/:id", async (req, res) => {
  await Membro.findByIdAndDelete(req.params.id);
  res.json({ message: "Membro eliminado" });
});

// Rota base
app.get("/", (req, res) => {
  res.send("API rodando! Use /api/membros");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT));




/*app.listen(3000, () => console.log("Servidor rodando na porta 3000"));*/

