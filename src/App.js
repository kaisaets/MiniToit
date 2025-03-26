import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRecipe, setNewRecipe] = useState({
    pealkiri: "",
    pilt: "",
    tekst: "",
  });
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility

  // Fetch recipes data from the backend
  useEffect(() => {
    fetch("http://localhost:3034/api/recipes")
      .then((response) => response.json())
      .then((json) => {
        // Add a 'showDetails' field to each recipe when we fetch the data
        const recipesWithDetails = json.map((recipe) => ({
          ...recipe,
          showDetails: false, // Initialize showDetails to false
        }));
        setData(recipesWithDetails);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecipe((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission to add a new recipe
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const { pealkiri, pilt, tekst } = newRecipe;

    if (!pealkiri || !pilt || !tekst) {
      alert("Palun täida kõik väljad.");
      return;
    }

    const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    // Create the new recipe object with the current date
    const recipeWithDate = {
      pealkiri,
      pilt,
      tekst,
      aeg: currentDate, // Add current date here
    };

    // POST request to add the new recipe to the backend
    fetch("http://localhost:3034/api/recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRecipe),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Uus retsept lisatud:", data);
        // Add new recipe to the list with showDetails initialized to false
        setData((prevData) => [
          { ...data, showDetails: false },
          ...prevData,
        ]);
        setNewRecipe({
          pealkiri: "",
          pilt: "",
          tekst: "",
        }); // Reset the form fields
      })
      .catch((error) => {
        console.error("Ilmnes viga!:", error);
      });
  };

  // Toggle form visibility
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  // Toggle visibility of recipe details
  const toggleRecipeDetails = (id) => {
    setData((prevData) =>
      prevData.map((recipe) =>
        recipe.id === id
          ? { ...recipe, showDetails: !recipe.showDetails }
          : recipe
      )
    );
  };

  if (loading) return <p>Laeb...</p>;
  if (error) return <p>Viga: {error}</p>;

  return (
    <div className="container">
      <header>
        <h1 className="title">Mudilasesõbralikud retseptid</h1>
        {/* Button to toggle the form */}
        <button className="add-recipe-btn" onClick={toggleForm}>
          {showForm ? "Tühista" : "Lisa uus retsept"}
        </button>
      </header>

      {/* Conditionally render the form based on showForm state */}
      {showForm && (
        <div className="form-card">
          <h2>Lisa uus retsept</h2>
          <form onSubmit={handleFormSubmit}>
            <div>
              <label htmlFor="pealkiri">Pealkiri:</label>
              <input
                type="text"
                id="pealkiri"
                name="pealkiri"
                value={newRecipe.pealkiri}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="pilt">Pildi aadress:</label>
              <input
                type="text"
                id="pilt"
                name="pilt"
                value={newRecipe.pilt}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="tekst">Juhised:</label>
              <textarea
                id="tekst"
                name="tekst"
                value={newRecipe.tekst}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <button type="submit">Lisa retsept</button>
          </form>
        </div>
      )}

      {/* Recipe List */}
      <div className="recipe-list">
        {data.map((item) => (
          <div key={item.id} className="recipe-card">
            <h2>{item.pealkiri}</h2>
            <div className="recipe-image-container">
            <img
              src={item.pilt}
              alt={item.pealkiri}
              className="recipe-image"
            />
            <button className="button" onClick={() => toggleRecipeDetails(item.id)}>
              {item.showDetails ? "Sulge" : "Ava"}
            </button>
            </div>
            {item.showDetails && (
              <div
                className="recipe-description"
                dangerouslySetInnerHTML={{ __html: item.tekst }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;