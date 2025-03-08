import React, { useState } from "react";
import "../styles/SideBar.css";
import axios from "axios";

const SideBar = ({ setCoords, unit, setUnit, toggleMenu }) => {
  const [inputLocation, setInputLocation] = useState("");

  const handleLocationChange = (event) => {
    setInputLocation(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!inputLocation.trim()) return;

    try {
      const response = await axios.get("https://api.openweathermap.org/geo/1.0/direct", {
        params: { q: inputLocation, limit: 1, appid: process.env.REACT_APP_WEATHER_API_KEY },
      });
      if (response.data.length === 0) {
        console.error("No results found for location:", inputLocation);
        return;
      }

      const { lat, lon } = response.data[0];
      const newCoords = { lat: lat, lon: lon };
      setCoords(newCoords);
      toggleMenu();
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  const toggleUnit = () => {
    const newUnit = unit === "metric" ? "imperial" : "metric";
    setUnit(newUnit);
    localStorage.setItem("unit", newUnit);
    toggleMenu(); // Close the sidebar after selection
  };

  return (
    <div className="sidebar-content">
      <h2>Settings</h2>
      <form onSubmit={handleSubmit} className="location-form">
        <input
          type="text"
          value={inputLocation}
          onChange={handleLocationChange}
          placeholder="Enter new location"
          className="location-input"
        />
        <button type="submit" className="submit-button">Set Location</button>
      </form>
      <button onClick={toggleUnit} className="unit-toggle-button">
        Switch to {unit === "metric" ? "Fahrenheit (°F)" : "Celsius (°C)"}
      </button>
    </div>
  );
};

export default SideBar;
