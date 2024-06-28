const express = require('express');
const app = express();
const port = 3000;
const db = require('./database');

app.use(express.json());


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.send('Welcome to the User API. Use /users to get the list of users.');
  });

app.get('/users', (req, res) => {
    db.all("SELECT * FROM users", (err, rows) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json(rows);
    });
});

app.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  db.get("SELECT * FROM users WHERE id = ?", [userID], (err, row) => {
    if (err) {
        res.status(500).json({error: err.message});
        return;
    }
    if (row) {
        res.json(row);
    }
    else {
        res.status(404).json({message: 'User not found'});
    }
  });
});

app.post('/users', (req, res) => {
  const { name, email, age } = req.body;
  db.run("INSERT INTO users (name, email, age) VALUES (?, ?, ?)", [name, email, age], function(err) {
    if (err) {
        console.error('Error inserting user:', err.message);
        res.status(500).json({error: err.message});
        return;
    }
    res.status(201).json({id: this.lastID, name, email, age});
  });
});


app.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email, age} = req.body;
  db.run("UPDATE users SET name = ?, email = ?, age = ? WHERE  id =?", [name, email, age, userId], function(err) {
    if (err) {
        res.status(500).json({ error: err.message });
        return;
    }
    if (this.changes === 0) {
    res.status(404).json({message: 'User not found'});
    return;
  }
  res.json({id: userId, name, email, age});
    });
});

app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  db.run("DELETE FROM users WHERE id = ?", [userId], function(err) {
    if (err) {
        res.status(500).json({error: err.message});
        return;
    }
    if (this.changes === 0) {
        res.status(404).json({ message: 'User not found'});
        return;
    }
    res.json({ message: 'User deleted successfully'});
  });
});

process.on('SIGINT', () => {
    console.log('Server is shutting down...');
    db.run("DROP TABLE IF EXISTS users", (err) => {
      if (err) {
        console.error('Error dropping table:', err.message);
      } else {
        console.log('Table users dropped successfully.');
      }
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('Database connection closed.');
        }
        process.exit(0);
      });
    });
  });