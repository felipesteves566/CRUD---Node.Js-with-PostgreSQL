const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// CREATE
app.post('/api/pessoas', async (req, res) => {
  const { nome, rua, numero, bairro, cidade } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO pessoa (nome, rua, numero, bairro, cidade) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nome, rua, numero, bairro, cidade]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ
app.get('/api/pessoas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pessoa');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.put('/api/pessoas/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, rua, numero, bairro, cidade } = req.body;
  try {
    const result = await pool.query(
      'UPDATE pessoa SET nome = $1, rua = $2, numero = $3, bairro = $4, cidade = $5 WHERE id = $6 RETURNING *',
      [nome, rua, numero, bairro, cidade, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete('/api/pessoas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM pessoa WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
