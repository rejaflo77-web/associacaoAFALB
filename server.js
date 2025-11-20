require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const Membro = require("./models/Membro");
const Quota = require("./models/Quota");

const app = express();
app.use(cors());
app.use(express.json());

// === Conexão MongoDB ===
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Ligado ao MongoDB Atlas"))
  .catch(err => console.error("❌ Erro ao conectar:", err));

// === Multer (Upload de Fotos) ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// === Arquivos estáticos ===
const __dirnameAbs = path.resolve();
app.use(express.static(path.join(__dirnameAbs, "public")));
app.use("/uploads", express.static(path.join(__dirnameAbs, "uploads")));

// === ROTAS QUOTAS ===
app.get("/api/quotas", async (req, res) => {
  const quotas = await Quota.find();
  res.json(quotas);
});

app.post("/api/quotas", async (req, res) => {
  try {
    const { nome, ano, valor, codigo } = req.body;

    if (codigo !== process.env.ADMIN_CODE) {
      return res.status(403).json({ success: false, message: "Código de administrador inválido" });
    }

    const novaQuota = new Quota({ nome, ano, valor });
    await novaQuota.save();
    res.json({ success: true, quota: novaQuota });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

// === ROTAS MEMBROS ===
app.get("/api/membros", async (req, res) => {
  const membros = await Membro.find();
  res.json(membros);
});

app.post("/api/membros", upload.single("foto"), async (req, res) => {
  const membro = new Membro({
    nome: req.body.nome,
    email: req.body.email,
    cargo: req.body.cargo,
    pais: req.body.pais,
    telefone: req.body.telefone,
    foto: `/uploads/${req.file.filename}`,
  });
  await membro.save();
  res.json({ success: true, membro });
});

app.put("/api/membros/:id", async (req, res) => {
  const membro = await Membro.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, membro });
});

app.delete("/api/membros/:id", async (req, res) => {
  await Membro.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// === FRONTEND ===
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirnameAbs, "public", "quota.html"));
});
app.get("/membros", (req, res) => {
  res.sendFile(path.join(__dirnameAbs, "public", "membros.html"));
});

// === START SERVER ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor ativo em http://localhost:${PORT}`));

