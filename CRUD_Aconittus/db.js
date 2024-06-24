// db.js
console.log('Iniciando o script de criação da tabela');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'projeto_crud',
  password: '123456',
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.stack);
    return;
  }
  console.log('Conexão com o banco de dados estabelecida');
  release();
});


const createTableQuery = `
  CREATE TABLE IF NOT EXISTS Pessoa (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    rua VARCHAR(100),
    numero INTEGER,
    bairro VARCHAR(100),
    cidade VARCHAR(100)
  )
`;

pool.query(createTableQuery)
  .then(() => console.log('Tabela criada com sucesso'))
  .catch((err) => console.error('Erro ao criar tabela:', err));

module.exports = pool;

