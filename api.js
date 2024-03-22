const express = require('express');
const pdf = require('pdfkit');
const fs = require('fs');
const app = express();

app.use(express.json());

const laboratorios = [
  { id: 1, nome: 'Laboratório 1', capacidade: 20, descricao: 'Laboratório de física' },
  { id: 2, nome: 'Laboratório 2', capacidade: 30, descricao: 'Laboratório de química' },
  { id: 3, nome: 'Laboratório 3', capacidade: 40, descricao: 'Laboratório de biologia' },
  { id: 4, nome: 'Laboratório 4', capacidade: 50, descricao: 'Laboratório de informática' },
  { id: 5, nome: 'Laboratório 5', capacidade: 60, descricao: 'Laboratório de matemática' },
  { id: 6, nome: 'Laboratório 6', capacidade: 70, descricao: 'Laboratório de geografia' },
];

const checkHour = (req, res, next) => {
  const currentHour = new Date().getHours();
  if (currentHour >= 8 && currentHour <= 17) {
    next();
  } else {
    res.status(403).json({ error: 'Acesso ao laboratório permitido apenas entre 08:00 e 17:00' });
  }
};

app.get('/laboratorio/todos', checkHour, (req, res) => {
  res.json(laboratorios);
});

app.post('/laboratorio/novo', checkHour, (req, res) => {
  const laboratorio = req.body;
  laboratorio.id = laboratorios.length + 1;
  laboratorios.push(laboratorio);
  res.status(201).json(laboratorio);
});

app.get('/laboratorio/relatorio', checkHour, (req, res) => {
  const doc = new pdf();
  doc.pipe(fs.createWriteStream('laboratorios.pdf'));
  doc.text(`Relatório de Laboratórios: ${new Date()}`);
  doc.text('Nome\t\tCapacidade\tDescrição');
  laboratorios.forEach(laboratorio => {
    doc.text(`${laboratorio.nome}\t${laboratorio.capacidade}\t${laboratorio.descricao}`);
  });
  doc.end();
  res.download('laboratorios.pdf', 'laboratorios.pdf');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(5000, () => {
  console.log('Listening on http://localhost:5000');
});