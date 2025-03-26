
const express = require('express');
const mysql = require('mysql2'); // MySQL client
const cors = require('cors'); // CORS package to enable cross-origin requests
const app = express();
const port = 3034;

// Enable CORS for all routes (you can modify this based on your needs)
app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type"
}));
app.use(express.json())

// Create MySQL connection pool
const pool = mysql.createPool({
  host: '192.168.35.105',
  user: 'dbuser', // Your MySQL username
  password: 'qwerty', // Your MySQL password
  database: 'minitoit', // Your MySQL database name
});

// Simple route to fetch data from MySQL and return it as JSON
app.get('/api/recipes', (req, res) => {
  const query = 'SELECT * FROM retseptid'; // SQL query to get all data from `retseptid` table

  pool.query(query, (err, data) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    
    // Set content type header
    res.setHeader('Content-Type', 'application/json');
    
    // Send the data as JSON
    res.json(data);
  });
});
app.get("/", (req, res) => { 
  res.send("Tagapool töötab"); 
});

app.get("/api/recipes", (req, res) => {
  res.json({message: "API töötab", data: [1, 2, 3, 4, 5]});
} );

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
