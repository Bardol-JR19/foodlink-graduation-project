const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'foodlink',
  password: '455218',
  port: 5432,
});

app.get('/api/donations', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM donations ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/donations', async (req, res) => {
  const { food_type, quantity, expiry_date, address } = req.body;
  if (!food_type || !quantity || !expiry_date || !address) {
    return res.status(400).json({ error: "All fields are required." });
  }
  try {
    const query = `
      INSERT INTO donations (food_type, quantity, expiry_date, address, status) 
      VALUES ($1, $2, $3, $4, 'available') RETURNING *;
    `;
    const newDonation = await pool.query(query, [food_type, quantity, expiry_date, address]);
    res.status(201).json(newDonation.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});