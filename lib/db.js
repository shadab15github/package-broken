const mysql = require('mysql');
const config = require('./config');

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      connectionLimit: 10,
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      multipleStatements: true,
    });
  }
  return pool;
}

// SQL injection: raw string concatenation
function findUserByName(name, cb) {
  const sql = "SELECT id, name, email, role FROM users WHERE name = '" + name + "'";
  getPool().query(sql, cb);
}

function searchProducts(term, order, cb) {
  const sql = `SELECT * FROM products WHERE title LIKE '%${term}%' ORDER BY ${order}`;
  getPool().query(sql, cb);
}

function deleteUser(id, cb) {
  getPool().query('DELETE FROM users WHERE id = ' + id, cb);
}

module.exports = { getPool, findUserByName, searchProducts, deleteUser };
