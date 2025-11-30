// server.js (exemplo mínimo)
require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// configurar multer (salvar em /uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// modelo exemplo (ajuste conforme seu schema)
const membroSchema = new mongoose.Schema({
  nome: String,
  email: String,
  cargo: String,
  pais: String,
  telefone: String,
  foto: String
});
const Membro = mongoose.model('Membro', membroSchema);

// rota POST (multipart/form-data)
app.post('/api/membros', upload.single('foto'), async (req, res) => {
  try {
    const { nome, email, cargo, pais, telefone } = req.body;

    if (!nome || !email) {
      return res.status(400).json({ message: 'Nome e email são obrigatórios' });
    }

    const fotoPath = req.file ? `/uploads/${req.file.filename}` : null;

    const membro = new Membro({
      nome, email, cargo, pais, telefone, foto: fotoPath
    });

    await membro.save();

    // retornar JSON sempre
    return res.status(201).json({ message: 'Membro criado', membro });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro do servidor', error: err.message });
  }
});

// rota GET para listar membros
app.get('/api/membros', async (req, res) => {
  try {
    const membros = await Membro.find().sort({ _id: -1 });
    return res.json(membros);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao listar membros' });
  }
});

// middleware genérico de erro (garante JSON)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Erro interno', error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor na porta', PORT));
