const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'postgresql',
  host: 'localhost',
  port: 5432, // default Postgres port
  database: 'master_thesis'
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};