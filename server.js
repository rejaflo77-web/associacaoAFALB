require("dotenv").config();
console.log("MONGO_URI =", process.env.MONGO_URI);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Servir imagens da pasta uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Conectar ao MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado com sucesso!"))
  .catch(err => console.error("❌ Erro ao conectar no MongoDB:", err));

// ✅ Modelo Membro
const MembroSchema = new mongoose.Schema({
  nome: String,
  email: String,
  cargo: String,
  pais: String,
  telefone: String,
  foto: String
});

const Membro = mongoose.model("Membro", MembroSchema);

// ✅ Configuração do upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// ===================================================
// ✅ ROTAS
// ===================================================

// ✅ CRIAR MEMBRO
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
    res.json({ message: "Membro criado com sucesso", data: novo });
  } catch (error) {
    console.error("Erro ao criar membro:", error);
    res.status(500).json({ erro: "Erro ao criar membro" });
  }
});


// ✅ LISTAR MEMBROS  ✅ (ESSA ROTA FALTAVA!)
app.get("/api/membros", async (req, res) => {
  try {
    const membros = await Membro.find();

    const resultado = membros.map(m => ({
      id: m._id,
      nome: m.nome,
      email: m.email,
      cargo: m.cargo,
      pais: m.pais,
      telefone: m.telefone,
      foto: m.foto
        ? `${req.protocol}://${req.get("host")}${m.foto}`
        : null
    }));

    res.json(resultado);
  } catch (error) {
    console.error("Erro ao buscar membros:", error);
    res.status(500).json({ erro: "Erro ao buscar membros" });
  }
});


// ✅ EDITAR MEMBRO
app.put("/api/membros/:id", async (req, res) => {
  try {
    await Membro.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Membro atualizado com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar membro" });
  }
});

// ✅ APAGAR MEMBRO
app.delete("/api/membros/:id", async (req, res) => {
  try {
    await Membro.findByIdAndDelete(req.params.id);
    res.json({ message: "Membro eliminado com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao eliminar membro" });
  }
});


// ✅ Rota principal
app.get("/", (req, res) => {
  res.send("API rodando! Use /api/membros para acessar os membros.");
});

// ✅ Porta do Render ou local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log("Servidor rodando na porta " + PORT)
);



/*app.listen(3000, () => console.log("Servidor rodando na porta 3000"));*/

