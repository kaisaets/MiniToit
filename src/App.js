import React, { useEffect, useState } from "react";
import './App.css'

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3034/api/recipes")
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container">
      <h1 className="title">MINITOIT - Mudilasesõbralikud retseptid</h1>
      <div className="recipe-list">
        {data.map((item) => (
          <div key={item.id} className="recipe-card">
            <h2>{item.pealkiri}</h2>
            <img src={item.pilt} alt={item.pealkiri} className="recipe-image" />
            <div className="recipe-description" dangerouslySetInnerHTML={{ __html: item.tekst }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;