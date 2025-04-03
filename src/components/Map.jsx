import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer,  Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import L from "leaflet";
import "../api/map.js";
import "../styles/Map.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getLayerAPI, getWeatherLayers } from "../api/map";
import { GoogleMap, LoadScript, DirectionsRenderer,useJsApiLoader,Marker } from "@react-google-maps/api";

const googleMapsKey = process.env.REACT_APP_GOOGLE_API_KEY;
const openWeatherMapKey = process.env.REACT_APP_WEATHER_API_KEY;
const containerStyle = { width: "100%", height: "300px",borderRadius: "15px" };

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

const Map = ({ lats, lons,route,setRoute,coords,start,end,setStart,setEnd }) => {
  const [selectedLayers, setSelectedLayers] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [directions, setDirections] = useState(null);
  const [routeFromStorage] = useState(JSON.parse(localStorage.getItem("route")))

  const [isZero,setIsZero] = useState(false)
  
  const [centre,setCentre] = useState({lat:coords.lat,lng:coords.lon})
  
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
        travelMode: window.google.maps.TravelMode.WALKING,
        provideRouteAlternatives:true,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          console.log(result)
          console.log(result.routes.length)
          setDirections(result);
        } else {
          
          setIsZero(prev => !prev)
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
    
      getRoute(route.origin,route.destination)

    }

    console.log(route)
  },[isLoaded,route])

  const reset = () => {
    setRoute((prevRoute) => ({
      ...prevRoute, // Keep existing properties
      origin: coords, // Update origin
      destination: null, // Update destination
    }));

    setDirections(null)
    localStorage.removeItem("route");
  }


  const makeNull2 = () => {
    setRoute(prevRoute => ({
      ...prevRoute,   // Keep all existing properties
      destination: null    // Modify only 'origin'
    }));
  }

  const makeNull = () => {
    setRoute({
      origin:coords,
      destination:null
    })
  }

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


      {
        directions && <div className="closeRoute" style={{cursor:"pointer"}} onClick={reset}>
          X
        </div>
      }


      {(isZero && route.origin && route.destination) && <div>
        <div className="popup-overlay">
          <div className="popup">
          <h2>This route is not available, please refresh and try a route that is more viable  </h2>
          <button onClick={() => setIsZero(prev => !prev)} className="buttons">Close</button>
          </div>
        </div>
      </div> }
      
      {isLoaded ? (
        <GoogleMap
          center={centre}
          zoom={12}
          mapContainerStyle={containerStyle}
          onLoad={(map) => setMapInstance(map)}
          options={{
            mapTypeControl: false,
            fullscreenControl:false,
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