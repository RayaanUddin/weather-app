import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import L from "leaflet";
import "../api/map.js";
import "../styles/Map.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getLayerAPI, getWeatherLayers } from "../api/map";
import { GoogleMap, LoadScript, DirectionsRenderer,useJsApiLoader } from "@react-google-maps/api";

const googleMapsKey = process.env.REACT_APP_GOOGLE_API_KEY;
const openWeatherMapKey = process.env.REACT_APP_WEATHER_API_KEY;
const containerStyle = { width: "100%", height: "300px",borderRadius: "15px" };
const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // San Francisco

const customMarker = new L.Icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [20, 30], // Default Leaflet size
  iconAnchor: [12, 41], // Center bottom
  popupAnchor: [1, -34], // Popup positioning
});
const weatherLayers = {
  Temperature: "temp_new",
  Wind: "wind_new",
  Clouds: "clouds_new",
  Precipitation: "precipitation_new",
  Pressure: "pressure_new",
  Humidity: "humidity_new"
};

const Map = ({ lat, lon,route }) => {
  const [selectedLayers, setSelectedLayers] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [directions, setDirections] = useState(null);
  const [isOpen,setIsOpen] = useState(true)
  
  const start = { lat: 37.7749, lng: -122.4194 }; // San Francisco
  const end = { lat: 34.0522, lng: -118.2437 }; // Los Angeles  


  

  useEffect(() => {
    const hasShownHelp = localStorage.getItem("hasShownHelp");
    if (!hasShownHelp) {
      setShowHelp(true);
      localStorage.setItem("hasShownHelp", "true");
    }
  }, []);


  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleMapsKey,
  });

            
  const getRoute = (starts,ends) => {
      

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: starts,
        destination: ends,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          console.log(result)
          setDirections(result);
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  };




  useEffect(() => {

    if (!isLoaded) {
      return;
    }

    if (route.destination){
      console.log(route.origin)
      console.log(route.destination)
      getRoute(route.origin,route.destination)

    }


  //   getRoute();
    console.log(route)
  },[isLoaded])



  useEffect(() => {
    if (!mapInstance) return;

    // Clear existing overlays before adding new ones
    mapInstance.overlayMapTypes.clear();

    // Add all selected weather layers
    selectedLayers.forEach(layer => {
      const weatherLayer = new window.google.maps.ImageMapType({
        getTileUrl: (coord, zoom) =>
          `https://tile.openweathermap.org/map/${layer}/${zoom}/${coord.x}/${coord.y}.png?appid=${openWeatherMapKey}`,
        tileSize: new window.google.maps.Size(256, 256),
        opacity: 0.6,
        name: "Weather",
      });
      mapInstance.overlayMapTypes.push(weatherLayer);
    });
  }, [selectedLayers, mapInstance]);

  
  const toggleLayer = (layer) => {
    setSelectedLayers((prev) =>
      prev.includes(layer) ? prev.filter((l) => l !== layer) : [...prev, layer]
    );
  };

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
        
          {Object.entries(weatherLayers).map(([name, value]) => (
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
      {isLoaded ? (
        <GoogleMap
          center={defaultCenter}
          zoom={6}
          mapContainerStyle={containerStyle}
          onLoad={(map) => setMapInstance(map)}
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      ) : (
        <p>Loading map...</p>
      )}
      {(directions && isOpen ) && <div className="confirmation">
          <p className="disclaimer">Disclaimer: This is the most shaded route, but your actual path may vary.</p>
          <button className="confirmRoute" onClick={() => setIsOpen(prev => !prev)}>Close</button>
        </div>}

{/*       
<MapContainer
        center={[lat, lon]}
        zoom={5}
        className="h-[500px] w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />


        <TileLayer
          url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
        />

        {selectedLayers.map((layer) => (
          <TileLayer key={layer} url={getLayerAPI(layer)} />
        ))}

        <Marker position={[lat, lon]} icon={customMarker}>
          <Popup>Current Location</Popup>
        </Marker>
      </MapContainer> */}
    </div>
  );
};

export default Map;