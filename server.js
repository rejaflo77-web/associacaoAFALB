const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const Membro = require("./models/Membro");
const Quota = require("./models/quotas");

const app = express();
app.use(cors());
app.use(express.json());

// === 1️⃣ CONEXÃO AO MONGODB ATLAS ===
mongoose.connect("mongodb+srv://daniellolita298_db_user:aDmi2025@cluster0.gjtwc7f.mongodb.net/associacao?retryWrites=true&w=majority")
  .then(() => console.log("✅ Ligado ao MongoDB Atlas"))
  .catch(err => console.error("❌ Erro ao conectar:", err));

// === 2️⃣ CONFIGURAÇÃO DO MULTER (para upload de fotos) ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// === 3️⃣ SERVIR FICHEIROS ESTÁTICOS ===
const __dirnameAbs = path.resolve();
app.use(express.static(path.join(__dirnameAbs, "public")));
app.use("/uploads", express.static(path.join(__dirnameAbs, "uploads")));

// === 4️⃣ ROTAS ===

// → Listar membros
app.get("/api/membros", async (req, res) => {
  const membros = await Membro.find();
  res.json(membros);
});

// → Adicionar novo membro
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
  res.json(membro);
});

// → Editar membro
app.put("/api/membros/:id", async (req, res) => {
  const membro = await Membro.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(membro);
});

// → Apagar membro// 
/*
app.delete("/api/membros/:id", async (req, res) => {
  await Membro.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});*/

// === 5️⃣ ROTA PARA O HTML ===
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirnameAbs, "public", "membros.html"));
});

app.post("/api/quotas", async (req, res) => {
  try {
    const { nome, ano, valor } = req.body;
    const novaQuota = new Quota({ nome, ano, valor });

    await novaQuota.save();
    res.json({ success: true, quota: novaQuota });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

app.get("/api/quotas", async (req, res) => {
  const quotas = await Quota.find();
  res.json(quotas);
});


// === 6️⃣ INICIAR SERVIDOR ===
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Servidor ativo em http://localhost:${PORT}`));