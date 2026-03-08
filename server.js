require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require(`cors`);

let cadastros = [];
let proximoId = 1;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://medicos-dentistas-voluntarios-u37e.vercel.app",
      "https://medicos-dentistas-voluntarios-u37e-fcv2ndw9z.vercel.app",
    ],
  }),
);

app.use(express.json());

function emailValido(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function telefoneValido(telefone) {
  const regex = /^[0-9]{10,11}$/;
  return regex.test(telefone);
}

function validarCadastro(req, res, next) {
  const { nome, email, telefone, mensagem } = req.body;
  if (!nome || nome.length < 3) {
    return res.status(400).json({
      erro: "Nome é obrigatório e deve ter pelo menos 3 caracteres",
    });
  }
  if (!email || !emailValido(email)) {
    return res.status(400).json({
      erro: "Email inválido",
    });
  }

  if (!telefone || !telefoneValido(telefone)) {
    return res.status(400).json({
      erro: "Telefone inválido",
    });
  }

  if (mensagem && mensagem.length > 500) {
    return res.status(400).json({
      erro: "Mensagem muito longa (máximo 500 caracteres)",
    });
  }

  next();
}

app.get("/", (req, res) => {
  res.send("API rodando!");
});

app.get("/cadastros", (req, res) => {
  res.json(cadastros);
});

app.post("/cadastros", validarCadastro, (req, res) => {
  const { nome, email, telefone, mensagem } = req.body;

  const novoCadastro = {
    id: proximoId++,
    nome,
    email,
    telefone,
    mensagem: mensagem || null,
  };
  cadastros.push(novoCadastro);
  res.status(201).json({
    mensagem: "Cadastro enviado com sucesso",
    cadastro: novoCadastro,
  });
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
