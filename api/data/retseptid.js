app.get('/data', (req, res) => {
    const query = 'SELECT * FROM retseptid';
    db.query(query, (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Database query error' });
      } else {
        res.json(results);  // Send the data as JSON
      }
    });
  });