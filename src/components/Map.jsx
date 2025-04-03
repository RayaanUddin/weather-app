import React, {useEffect, useState} from "react";
import "leaflet/dist/leaflet.css";
import {faCog} from "@fortawesome/free-solid-svg-icons";
import "../api/map.js";
import "../styles/Map.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {getLayerAPI, getWeatherLayers} from "../api/map";
import {DirectionsRenderer, GoogleMap, Marker, useJsApiLoader} from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "40vh",borderRadius: "15px" };

const Map = ({ route,setRoute,coords}) => {
  const [selectedLayers, setSelectedLayers] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [directions, setDirections] = useState(null);
  
  const [centre] = useState({lat:coords.lat,lng:coords.lon});
  
  useEffect(() => {
    const hasShownHelp = localStorage.getItem("hasShownHelp");
    if (!hasShownHelp) {
      setShowHelp(true);
      localStorage.setItem("hasShownHelp", "true");
    }
  }, []);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });

  const getRoute = (starts,ends) => {
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: starts,
        destination: ends,
        travelMode: window.google.maps.TravelMode.WALKING,
        provideRouteAlternatives:true,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          console.log(result)
          console.log(result.routes.length)
          setDirections(result);
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  };

  // gets the route the user wants in quick succession
  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    if (route.destination){
      getRoute(route.origin,route.destination)
    }
  },[isLoaded,route])

  // deletes the route if user does not want it displayed by a press of a button
  const reset = () => {
    setRoute((prevRoute) => ({
      ...prevRoute, // Keep existing properties
      origin: coords, // Update origin
      destination: null, // Update destination
    }));

    setDirections(null)
    localStorage.removeItem("route");
  }

  // toggles the layers the user wants on the map, whether it is wind or temperature, it would display to the user
  const toggleLayer = (layer) => {
    setSelectedLayers((prev) =>
      prev.includes(layer) ? prev.filter((l) => l !== layer) : [...prev, layer]
    );
  };
  


  // displays the layers on the map on the user
  useEffect(() => {
    if (!mapInstance) return;

    mapInstance.overlayMapTypes.clear(); // Clear previous overlays

    // Loop through selected layers and add each one
    selectedLayers.forEach((layer) => {
      const weatherLayer = new window.google.maps.ImageMapType({
        getTileUrl: (cord, zoom) => {
          // Use coordinates and zoom to build the weather tile URL dynamically
          return getLayerAPI(layer, cord.x, cord.y, zoom);
        },
        tileSize: new window.google.maps.Size(256, 256),  // Standard tile size
        opacity: 0.6, // Adjust opacity of the weather layers as needed
        name: layer,  // Name of the layer
      });

      // Push the weather layer to the map's overlayMapTypes
      mapInstance.overlayMapTypes.push(weatherLayer);
    });
  }, [selectedLayers, mapInstance]);


  return (
    <div className="map-container">
      <div>
        <button className="settings-button" onClick={() => {
          setShowSettings(!showSettings)
          setShowHelp(false)
        }}>
          <FontAwesomeIcon icon={faCog} />
        </button>
        {showHelp && (
          <img className="help" src={require("../assets/layer_help.png")} alt="help" style={{ width: "200px", top: 30, right: 30 }} />
        )}
      </div>
      {showSettings && (
        <div className="settings-panel">
          <h3>Weather Layers</h3>
        
          {Object.entries(getWeatherLayers()).map(([name, value]) => (
          <div key={value}>
            <label key={value}>
              <input
                type="checkbox"
                value={value}
                checked={selectedLayers.includes(value)}
                onChange={() => toggleLayer(value)}
              />
              {name}
            </label>
          </div>
        ))}
        </div>
      )}


      {
        directions && <div className="closeRoute" style={{cursor:"pointer"}} onClick={reset}>
          X
        </div>
      }
      

      {(route.origin && route.destination && directions?.status !== "OK") &&
        (
          <div>
            <div className="popup-overlay">
              <div className="popup">
              <h2>This route is not available. Try a route that is more viable.</h2>
              <button onClick={() => reset()} className="buttons">Close</button>
              </div>
            </div>
          </div>
        )
      }
      
      {isLoaded ? (
        <GoogleMap
          center={centre}
          zoom={12}
          mapContainerStyle={containerStyle}
          onLoad={(map) => setMapInstance(map)}
          options={{
            mapTypeControl: false,
            fullscreenControl:false,
            streetViewControl: false
          }}
        >
          {directions && <DirectionsRenderer directions={directions} />}
          <Marker position={centre}></Marker>
        </GoogleMap>
      ) : (
        <>
        <div className="popup-overlay">
          <div className="popup">
            <h3>Loading Map..</h3>
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default Map;