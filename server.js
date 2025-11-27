require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

const app = express();
app.use(cors());
app.use(express.json());

// Configuração Cloudinary
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

// Conexão MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado com sucesso!"))
  .catch(err => console.error("❌ Erro MongoDB:", err));

// Modelo
const MembroSchema = new mongoose.Schema({
  nome: String,
  email: String,
  cargo: String,
  pais: String,
  telefone: String,
  foto: String,
});

const Membro = mongoose.model("Membro", MembroSchema);

// Rotas

// Criar membro
app.post("/api/membros", upload.single("foto"), async (req, res) => {
        console.log("req.body:", req.body);
        console.log("req.file:", req.file);
  try {
    console.log("Recebido:", req.body, req.file); // log para depuração
    const novo = new Membro({
      nome: req.body.nome,
      email: req.body.email,
      cargo: req.body.cargo,
      pais: req.body.pais,
      telefone: req.body.telefone,
      foto: req.file?.path || null,
    });

    const salvo = await novo.save();
    console.log("Salvo:", salvo);
    res.json(salvo);

  } catch (error) {
    console.error("Erro ao criar membro:", error);
    res.status(500).json({ erro: "Erro ao criar membro" });
  }
});

// Listar membros
app.get("/api/membros", async (req, res) => {
  const membros = await Membro.find();
  res.json(membros);
});

// Atualizar membro
app.put("/api/membros/:id", async (req, res) => {
  await Membro.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Atualizado com sucesso" });
});

// Apagar membro
app.delete("/api/membros/:id", async (req, res) => {
  await Membro.findByIdAndDelete(req.params.id);
  res.json({ message: "Removido com sucesso" });
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
