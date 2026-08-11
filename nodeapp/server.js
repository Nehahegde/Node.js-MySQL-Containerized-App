const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "mysqldb",
  port: 3306,
  user: "admin",
  password: "passw",
  database: "crudDB",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL Connection Error:", err);
    return;
  }
  console.log("MySQL Connected");
});

// Home Route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// CREATE
app.post("/users", (req, res) => {
  const { name, email, age } = req.body;

  const sql = "INSERT INTO users (name, email, age) VALUES (?, ?, ?)";

  db.query(sql, [name, email, age], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(201).json({
      id: result.insertId,
      name,
      email,
      age,
    });
  });
});

// READ ALL
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(results);
  });
});

// READ ONE
app.get("/users/:id", (req, res) => {
  db.query(
    "SELECT * FROM users WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(results[0]);
    }
  );
});

// UPDATE
app.put("/users/:id", (req, res) => {
  const { name, email, age } = req.body;

  const sql = "UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?";

  db.query(sql, [name, email, age, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully" });
  });
});

// DELETE
app.delete("/users/:id", (req, res) => {
  db.query(
    "DELETE FROM users WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});