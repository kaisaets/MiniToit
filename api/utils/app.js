
const express = require('express');
const mysql = require('mysql2'); 
const cors = require('cors'); // CORS package to enable cross-origin requests
const app = express();
const port = 3034;

// Enable CORS for all routes
app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type"
}));
app.use(express.json())


const pool = mysql.createPool({
  host: '192.168.35.105',
  user: 'dbuser', 
  password: 'qwerty', 
  database: 'minitoit', 
});

// Route to fetch data from MySQL and return it as JSON
app.get('/api/recipes', (req, res) => {
  const query = 'SELECT * FROM retseptid'; //get all data from `retseptid` table

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
  res.json({message: "API töötab", data: []});
} );

// POST route

app.post('/api/recipes', (req, res) => {
  const { pealkiri, pilt, tekst } = req.body;

  if (!pealkiri || !pilt || !tekst) {
    return res.status(400).json({ error: 'Kõik väljad peavad olema täidetud.' });
  }

  const query = 'INSERT INTO retseptid (pealkiri, pilt, tekst) VALUES (?, ?, ?)';
  pool.query(query, [pealkiri, pilt, tekst], (err, result) => {
    if (err) {
      console.error('Andmebaasi viga:', err);
      return res.status(500).json({ error: 'Andmebaasi viga', details: err.message });
    }

    res.status(201).json({
      id: result.insertId, // The ID of the newly added recipe
      pealkiri,
      pilt,
      tekst,
      showDetails: false, // Initially, don't show details
    });
    res.status(201).json(newRecipe); // Send the newly created recipe back to the client
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
