import React, { useState } from "react";
import LocationWeather from "./LocationWeather";
import { useErrorHandler } from "../utils/errorHandler";
import LocationInput from "./LocationInput";

/**
 * LocationSearch Component
 * This is part of the side panel where it allows user to search for a location to set, and preview history of searches.
 * @param setCoords
 * @param toggleMenu
 * @param unit
 * @param forecasts
 * @param searchHistory
 * @param setSearchHistory
 * @returns {JSX.Element}
 * @constructor
 */
const LocationSearch = ({ setCoords, toggleMenu, unit, forecasts, searchHistory, setSearchHistory }) => {
  const [inputLocation, setInputLocation] = useState(null);
  const { error, flashRed, handleError } = useErrorHandler(null, 10000);

  const handleLocationSearch = async () => {
    if (inputLocation) {
      setCoords(inputLocation);
      toggleMenu();
      if (inputLocation) {
        setCoords(inputLocation);
        // Update search history (avoid duplicates)
        if (!searchHistory.includes(inputLocation)) {
          const updatedHistory = [inputLocation, ...searchHistory].slice(0, 5);
          setSearchHistory(updatedHistory);
          localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
        }
      } else {
        handleError("Could not retrieve location.");
      }
    } else {
      handleError("Please select a location.");
    }
  };

  const handleHistorySearch = async (location) => {
    if (location) {
      setCoords(location);
      toggleMenu();
    } else {
      console.error("Geocoding error:", location);
    }
  };

  return (
    <div className="location-search">
      <div className="location-component">
        <LocationInput
          onPlaceChanged = {(place) => {
              if (place && place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                console.log("Latitude:", lat, "Longitude:", lng);
                setInputLocation({lon: lng, lat: lat});
              }
            }
          }
          className={`input ${flashRed ? "flash-red" : ""}`}
        />
        {error && <p className="error-message">{error}</p>}
        <button onClick={handleLocationSearch}>Search</button>
      </div>
      <h4>Previous Searches</h4>
      <div className="previous-locations">
        {searchHistory.map((coords) => {
          const key = `${coords.lat}, ${coords.lon}`;
          return (
            forecasts[key] ? (
              <LocationWeather
                forecast={forecasts[key]}
                key={key}
                unit={unit}
                onClick={() => handleHistorySearch(coords)}
              />
            ) : (
              <button key={key} onClick={() => handleHistorySearch(coords)}>
                loading...
              </button>
            )
          );
        })}
      </div>
    </div>
  );
};

export default LocationSearch;