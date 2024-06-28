const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./users.db');

db.serialize(() => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log("Users in database:");
    rows.forEach((row) => {
      console.log(`${row.id}: ${row.name} - ${row.email} - ${row.age}`);
    });
  });
});

db.close();