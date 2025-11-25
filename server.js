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
mongoose.connect("mongodb://localhost:27017/associacao")
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.log(err));

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
  const novo = new Membro({
    nome: req.body.nome,
    email: req.body.email,
    cargo: req.body.cargo,
    pais: req.body.pais,
    telefone: req.body.telefone,
    foto: req.file ? `/uploads/${req.file.filename}` : null,
  });

  await novo.save();
  res.json({ message: "Membro criado", data: novo });
});

// listar membros
app.get("/api/membros", async (req, res) => {
  const membros = await Membro.find();
  res.json(membros.map(m => ({
    id: m._id,
    nome: m.nome,
    email: m.email,
    cargo: m.cargo,
    pais: m.pais,
    telefone: m.telefone,
    foto: m.foto ? `http://localhost:3000${m.foto}` : null
  })));
});

// apagar membro
app.delete("/api/membros/:id", async (req, res) => {
  await Membro.findByIdAndDelete(req.params.id);
  res.json({ message: "Membro eliminado" });
});

// editar membro
app.put("/api/membros/:id", async (req, res) => {
  await Membro.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Membro atualizado" });
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));

