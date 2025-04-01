import React, { useState } from "react";
import { locationCoords } from "../api/location";
import LocationWeather from "./LocationWeather";
import { useErrorHandler } from "../utils/errorHandler";

const LocationSearch = ({ setCoords, toggleMenu, unit, forecasts, searchHistory, setSearchHistory }) => {
  const [inputLocation, setInputLocation] = useState("");
  const { error, flashRed, handleError } = useErrorHandler(null, 10000);

  const handleLocationSearch = async () => {
    if (inputLocation.trim() !== "") {
      const [success, coords] = await locationCoords(inputLocation);
      if (success) {
        setCoords(coords);
        toggleMenu();

        // Update search history (avoid duplicates)
        if (!searchHistory.includes(inputLocation)) {
          const updatedHistory = [inputLocation, ...searchHistory].slice(0, 5);
          setSearchHistory(updatedHistory);
          localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
        }
      } else {
        handleError("Could not retrieve location.");
        console.error("Geocoding error:", inputLocation);
      }
    }
  };

  const handleHistorySearch = async (location) => {
    const [success, coords] = await locationCoords(location);
    if (success) {
      setCoords(coords);
      toggleMenu();
    } else {
      console.error("Geocoding error:", location);
    }
  };

  return (
    <div className="location-search">
      <div className="location-component">
        <input
          type="text"
          value={inputLocation}
          onChange={(e) => setInputLocation(e.target.value)}
          placeholder="Enter location"
          className={`menu-button ${flashRed ? "flash-red" : ""}`}
        />
        {error && <p className="error-message">{error}</p>}
        <button onClick={handleLocationSearch}>Search</button>
      </div>
      <h4>Previous Searches</h4>
      <div className="previous-locations">
        {searchHistory.map((location, index) => (
          forecasts[location] ?
            <LocationWeather forecast={forecasts[location]} key={index} unit={unit} onClick={() => handleHistorySearch(location)} />
            : <button key={index} onClick={() => handleHistorySearch(location)}>loading...</button>
        ))}
      </div>
    </div>
  );
};

export default LocationSearch;