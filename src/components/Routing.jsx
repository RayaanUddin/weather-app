import React, { useState, useEffect } from "react";
import locationIcon from "../assets/location-icons/location_on.png";
import LocationInput from "./LocationInput";
import { convertCoordsToAddress } from "../api/location";
import { getCurrentCoords } from "../utils/getCurrentCoords";
import {useErrorHandler} from "../utils/errorHandler";

/**
 * Routing Component
 * This component is used to set the route for the map.
 * It allows the user to enter a starting point and an ending point.
 * It also provides a button to set the current location as the starting point.
 * It is part of the side panel.
 * @param setRoute
 * @param start
 * @param end
 * @param setStart
 * @param setEnd
 * @returns {JSX.Element}
 * @constructor
 */
function Routing({ setRoute, start, end, setStart, setEnd }) {
  const [directions, setDirections] = useState(null);
  const [currentCoords, setCurrentCoords] = useState(null);
  const { error, flashRed, handleError } = useErrorHandler(null, 10000);

  // Fetch the current location using getCurrentCoords
  useEffect(() => {
    const fetchCoords = async () => {
      const coords = await getCurrentCoords();
      if (coords) {
        setCurrentCoords(coords);
      } else {
        console.error("Error getting current coordinates");
      }
    };
    fetchCoords();
  }, []);

  // sets the routes when searching for a route
  const setRoutes = () => {
    if (end === "") {
      handleError("Please enter a final destination.");
      return;
    }
    if (start === "") {
      handleError("Please enter a start destination.");
      return;
    }
    const routeJSON = {
      origin: start,
      destination: end,
    };
    setRoute(routeJSON);
    setDirections(routeJSON);
    localStorage.setItem("route", JSON.stringify(routeJSON));
  };

  // toggle function for setting current coordinates as starting point
  const setCurrentCoordsToStarting = async () => {
    if (!currentCoords) {
      console.error("Current coordinates not available");
      return;
    }

    try {
      const location = await convertCoordsToAddress({
        lat: currentCoords.lat,
        lon: currentCoords.lon,
      });
      if (!location) {
        console.error("Error converting coordinates to address");
        return false;
      }
      setStart(location); // Set the address as the starting point
      return true;
    } catch (error) {
      console.error("Failed to get address:", error);
      return false;
    }
  };

  return (
    <div className="routing">
      <div className="location-component">
        <div className="location-container">
          {currentCoords && (
            <div className="route-current-location" onClick={setCurrentCoordsToStarting}>
              <img src={locationIcon} alt="current-location" style={{ cursor: "pointer" }} />
            </div>
          )}
          <LocationInput
            onPlaceChanged={(place) => {
              if (place && place.formatted_address) {
                setStart(place.formatted_address);
              }
            }}
            placeholder="Enter Starting Point"
            className={"input"}
            {...start && { value: start }}
          />
        </div>
        <LocationInput
          onPlaceChanged={(place) => {
            if (place && place.formatted_address) {
              setEnd(place.formatted_address);
            }
          }}
          placeholder="Enter Destination"
          className={"input"}
        />
        {error && <p className="error-message">{error}</p>}
        <button onClick={setRoutes} className={`searchButton ${flashRed ? "flash-red" : ""}`}>
          Search
        </button>
      </div>
      {directions && (
        <div className="confirmation">
          <p className="disclaimer">
            Disclaimer: This is the most shaded route, but your actual path may vary.
          </p>
        </div>
      )}
    </div>
  );
}

export default Routing;
