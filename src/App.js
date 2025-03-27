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
  const [showForm, setShowForm] = useState(false); // Peidab

  // Fetch recipes data from the backend
  useEffect(() => {
    fetch("http://localhost:3034/api/recipes")
      .then((response) => response.json())
      .then((json) => {
        // Ei kuva kirjeldust
        const recipesWithDetails = json.map((recipe) => ({
          ...recipe,
          showDetails: false, // esialgu
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

  // Handle input changes FORM
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecipe((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle submit FORM
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const { pealkiri, pilt, tekst } = newRecipe;

    if (!pealkiri || !pilt || !tekst) {
      alert("Palun täida kõik väljad.");
      return;
    }

    const currentDate = new Date().toISOString().split("T")[0];

    // aeg on currentDate
    const recipeWithDate = {
      pealkiri,
      pilt,
      tekst,
      aeg: currentDate, 
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
        // Uue retsepti kirjeldus peidetud
        setData((prevData) => [
          { ...data, showDetails: false },
          ...prevData,
        ]);
        setNewRecipe({
          pealkiri: "",
          pilt: "",
          tekst: "",
        }); // Tuhjendab valjad
      })
      .catch((error) => {
        console.error("Ilmnes viga!:", error);
      });
  };

  // Peidab vormi
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  // Peidab kirjelduse
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
        {/* Nupp*/}
        <button className="add-recipe-btn" onClick={toggleForm}>
          {showForm ? "Tühista" : "Lisa uus retsept"}
        </button>
      </header>

      {/* Kuva seda mida showForm lubab */}
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

      {/* Retseptid */}
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


//https://images.pexels.com/photos/939052/pexels-photo-939052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1
/*Koostisosad:
Pelmeenid (osta valmis või tee ise)

Vesi

Sool

Juhised:
Keeda vesi: Täida suur pott veega ja lisa sinna soola (umbes 1 tl soola 1 liitri vee kohta). Keeda vesi tugevasti.

Lisa pelmeenid: Kui vesi keeb, lisa pelmeenid ettevaatlikult keevasse vette. Ära pane liiga palju korraga, et pelmeenid saaksid vabalt ujuda.

Keeda pelmeenid: Kui pelmeenid on potis, sega neid õrnalt, et nad ei jääks kokku. Kui pelmeenid tõusevad pinnale, lase neil veel 2–4 minutit keeda, et need oleksid täiesti läbi keedetud. Täpselt aega võib varieerida sõltuvalt pelmeenide suurusest ja täidise tüübist.

Valmimine: Kui pelmeenid on üles kerkinud ja läbi keedetud, kurna need ära.

Serveerimine: Serveeri pelmeenid kuumalt, lisades näiteks hapukoort, võid või soovi korral sinepit või ketšupit.
*/