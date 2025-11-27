const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

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

// ---------------- CLOUDINARY ----------------
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


// ---------------- MONGODB ----------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado com sucesso!"))
  .catch((err) => console.error("❌ Erro MongoDB:", err));

// ---------------- MODELO ----------------
const MembroSchema = new mongoose.Schema({
  nome: String,
  email: String,
  cargo: String,
  pais: String,
  telefone: String,
  foto: String,
});

const Membro = mongoose.model("Membro", MembroSchema);

// ---------------- ROTAS ----------------

// ✅ CRIAR MEMBRO
app.post("/api/membros", upload.single("foto"), async (req, res) => {
  try {
    const novo = new Membro({
      nome: req.body.nome,
      email: req.body.email,
      cargo: req.body.cargo,
      pais: req.body.pais,
      telefone: req.body.telefone,
      foto: req.file ? req.file.path : null, // URL do Cloudinary
    });

    await novo.save();
    res.json({ message: "Membro criado", data: novo });

  } catch (error) {
    console.error("Erro ao criar membro:", error);
    res.status(500).json({ erro: "Erro ao criar membro" });
  }
});

// ✅ LISTAR MEMBROS
app.get("/api/membros", async (req, res) => {
  const membros = await Membro.find();
  res.json(membros);
});

// ✅ ATUALIZAR MEMBRO
app.put("/api/membros/:id", async (req, res) => {
  await Membro.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Atualizado com sucesso" });
});

// ✅ APAGAR MEMBRO
app.delete("/api/membros/:id", async (req, res) => {
  await Membro.findByIdAndDelete(req.params.id);
  res.json({ message: "Removido com sucesso" });
});

// ✅ ROTA TESTE
app.get("/", (req, res) => {
  res.send("✅ API rodando com Cloudinary!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT));
