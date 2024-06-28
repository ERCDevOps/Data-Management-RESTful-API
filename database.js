const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./users.db');

db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT, age INTEGER)");

  const stmt = db.prepare("INSERT INTO users (name, email, age) VALUES (?, ?, ?)");
  stmt.run("John Doe", "john.doe@example.com", 31);
  stmt.run("Jane Doe", "jane.doe@example.com", 28);
  stmt.finalize();
});

module.exports = db;