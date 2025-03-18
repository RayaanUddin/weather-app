import React, { useState, useEffect } from "react";
import "../styles/SideBar.css";
import "../api/location"
import {locationCoords} from "../api/location";

const SideBar = ({ setCoords, unit, setUnit, toggleMenu }) => {
  const [inputLocation, setInputLocation] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showChangeLocation, setShowChangeLocation] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const storedLocations = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(storedLocations);
  }, []);

  const handleLocationSearch = () => {
    if (inputLocation.trim() !== "") {
      locationCoords(inputLocation).then(([success, coords]) => {
        if (success) {
          setCoords(coords);
          toggleMenu();
          // Temporarily Needs refining
          const updatedHistory = [inputLocation, ...searchHistory].slice(0, 5);
          setSearchHistory(updatedHistory);
          localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
        } else {
          console.error("Geocoding error:", inputLocation);
        }
      });
    }
  };

  return (
    <div className="container">
      <button onClick={() => setShowChangeLocation(!showChangeLocation)}>Change Location</button>
      {showChangeLocation && (
        <div className="location-search">
          <input
            type="text"
            value={inputLocation}
            onChange={(e) => setInputLocation(e.target.value)}
            placeholder="Enter location"
          />
          <button onClick={handleLocationSearch}>Search</button>
          <h4>Previous Searches</h4>
          <ul>
            {searchHistory.map((location, index) => (
              <li key={index}>{location}</li>
            ))}
          </ul>
        </div>
      )}
      <button>Select a Route</button>
      <button>Settings</button>
    </div>
  );
};

export default SideBar;
