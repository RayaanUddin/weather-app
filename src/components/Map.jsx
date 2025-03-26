import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {faCog} from "@fortawesome/free-solid-svg-icons";
import L from "leaflet";
import "../api/map.js";
import "../styles/Map.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {getLayerAPI, getWeatherLayers} from "../api/map";

const customMarker = new L.Icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [20, 30], // Default Leaflet size
  iconAnchor: [12, 41], // Center bottom
  popupAnchor: [1, -34], // Popup positioning
});

const Map = ({ lat, lon }) => {
  const [selectedLayers, setSelectedLayers] = useState([]);
  const [showSettings, setShowSettings] = useState(false);

  const toggleLayer = (layer) => {
    setSelectedLayers((prev) =>
      prev.includes(layer)
        ? prev.filter((l) => l !== layer)
        : [...prev, layer]
    );
  };

  return (
    <div className="map-container">
      <button className="settings-button" onClick={() => setShowSettings(!showSettings)}>
        <FontAwesomeIcon icon={faCog}/>
        <img className="help" src={require("../assets/layer_help.png")} alt="help" style={{ width: "200px" }} />
      </button>

      {showSettings && (
        <div className="settings-panel">
          <h3>Weather Layers</h3>
          {Object.entries(getWeatherLayers()).map(([name, key]) => (
            <label key={key}>
              <input
                type="checkbox"
                checked={selectedLayers.includes(key)}
                onChange={() => toggleLayer(key)}
              />
              {name}
            </label>
          ))}
        </div>
      )}

      <MapContainer center={[lat, lon]} zoom={5} className="h-[500px] w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Render selected weather layers */}
        {selectedLayers.map((layer) => (
          <TileLayer
            key={layer}
            url={getLayerAPI(layer)}
          />
        ))}

        <Marker position={[lat, lon]} icon={customMarker}>
          <Popup>Current Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
