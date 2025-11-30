require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

const app = express();

// ================== MIDDLEWARES ==================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================== CLOUDINARY ==================
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "membros",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

// ================== MONGODB ==================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado com sucesso!"))
  .catch(err => console.error("❌ Erro MongoDB:", err));

// ================== MODEL ==================
const MembroSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  cargo: String,
  pais: { type: String, required: true },
  telefone: { type: String, required: true },
  foto: String,
}, { timestamps: true });

const Membro = mongoose.model("Membro", MembroSchema);

// ================== ROTAS ==================

// Criar membro
app.post("/api/membros", upload.single("foto"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ erro: "Foto obrigatória" });

    const novo = new Membro({
      nome: req.body.nome,
      email: req.body.email,
      cargo: req.body.cargo,
      pais: req.body.pais,
      telefone: req.body.telefone,
      foto: req.file.path || req.file.secure_url,
    });

    const salvo = await novo.save();
    res.json(salvo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao criar membro", detalhes: error.message });
  }
});

// Listar membros
app.get("/api/membros", async (req, res) => {
  try {
    const membros = await Membro.find().sort({ createdAt: -1 });
    res.json(membros);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao listar membros", detalhes: err.message });
  }
});

// Editar membro
app.put("/api/membros/:id", async (req, res) => {
  try {
    const atualizado = await Membro.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!atualizado) return res.status(404).json({ erro: "Membro não encontrado" });
    res.json(atualizado);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar membro", detalhes: err.message });
  }
});

// Deletar membro
app.delete("/api/membros/:id", async (req, res) => {
  try {
    const deletado = await Membro.findByIdAndDelete(req.params.id);
    if (!deletado) return res.status(404).json({ erro: "Membro não encontrado" });
    res.json({ message: "Removido com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao deletar membro", detalhes: err.message });
  }
});

// ================== PORTA ==================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Servidor rodando na porta " + PORT));

