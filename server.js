require('dotenv').config();
console.log("MONGO_URI =", process.env.MONGO_URI);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// servir fotos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// conectar MongoDB

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado com sucesso!"))
  .catch(err => console.error("❌ Erro ao conectar no MongoDB:", err));


/*
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB conectado!"))
.catch(err => console.log(err));*/

// modelo
const MembroSchema = new mongoose.Schema({
  nome: String,
  email: String,
  cargo: String,
  pais: String,
  telefone: String,
  foto: String, // URL da imagem
});

const Membro = mongoose.model("Membro", MembroSchema);

// configurar upload de imagem
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ROTAS
// criar membro
app.post("/api/membros", upload.single("foto"), async (req, res) => {
  try {
    const novo = new Membro({
      nome: req.body.nome,
      email: req.body.email,
      cargo: req.body.cargo,
      pais: req.body.pais,
      telefone: req.body.telefone,
      foto: req.file ? `/uploads/${req.file.filename}` : null
    });

    await novo.save();
    res.json({ message: "Membro criado", data: novo });

  } catch (error) {
    console.error("Erro ao criar membro:", error);
    res.status(500).json({ erro: "Erro ao criar membro" });
  }
});


// listar membros
app.post("/api/membros", upload.single("foto"), async (req, res) => {
  try {
    const novo = new Membro({
      nome: req.body.nome,
      email: req.body.email,
      cargo: req.body.cargo,
      pais: req.body.pais,
      telefone: req.body.telefone,
      foto: m.file ? `/uploads/${req.file.filename}` : null
    });

    await novo.save();
    res.json({ message: "Membro criado", data: novo });

  } catch (error) {
    console.error("Erro ao criar membro:", error);
    res.status(500).json({ erro: "Erro ao criar membro" });
  }
});


// editar membro
app.put("/api/membros/:id", async (req, res) => {
  await Membro.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Membro atualizado" });
});

app.get("/", (req, res) => {
  res.send("API rodando! Use /api/membros para acessar os membros.");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT));


/*app.listen(3000, () => console.log("Servidor rodando na porta 3000"));*/

