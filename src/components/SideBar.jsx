import React, { useState, useEffect } from "react";
import "../styles/SideBar.css";
import { locationCoords } from "../api/location";
import { fetchCurrentForecast } from "../api/forecast";
import * as unitConversion from "../utils/unitConversion";
import LocationWeather from "./LocationWeather";
import { useErrorHandler } from "../utils/errorHandler";

const SideBar = ({ setCoords, unit, setUnit, toggleMenu }) => {
  const [inputLocation, setInputLocation] = useState("");
  const [showChangeLocation, setShowChangeLocation] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [forecasts, setForecasts] = useState({}); // Store forecasts in an object
  const { error, flashRed, handleError } = useErrorHandler(null, 10000);

  // Load search history from localStorage
  useEffect(() => {
    const storedLocations = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(storedLocations);
  }, []);

  // Fetch forecasts whenever searchHistory changes
  useEffect(() => {
    const fetchForecasts = async () => {
      const results = await Promise.all(
        searchHistory.map(async (location) => {
          try {
            const response = await fetchCurrentForecast(location);
            return { location, forecast: response.data };
          } catch (error) {
            console.error(`Error fetching forecast for ${location}:`, error);
            // Remove from history
            const updatedHistory = searchHistory.filter((item) => item !== location);
            setSearchHistory(updatedHistory);
            localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
            return { location, forecast: null }; // Set null on failure
          }
        })
      );

      // Convert results into an object for efficient lookup
      const forecastsObject = results.reduce((acc, item) => {
        acc[item.location] = item.forecast;
        return acc;
      }, {});

      setForecasts(forecastsObject);
    };

    if (searchHistory.length > 0) {
      fetchForecasts();
    }
  }, [searchHistory]);

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
          {error && <p className="error-message">{error}</p>}
          <button onClick={handleLocationSearch}>Search</button>
          <h4>Previous Searches</h4>
          <div className="previous-locations">
            {searchHistory.map((location, index) => (
              forecasts[location]?
                <LocationWeather forecast={forecasts[location]} key={index} unit={unit} onClick={() => handleHistorySearch(location)}/>
                : <button key={index} onClick={() => handleHistorySearch(location)}>loading...</button>
            ))}
          </div>
        </div>
      )}
      <button>Select a Route</button>
      <button>Settings</button>
    </div>
  );
};

export default SideBar;