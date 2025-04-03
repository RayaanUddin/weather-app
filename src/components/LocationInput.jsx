import React, { useEffect, useRef } from 'react';

const LocationSearch = ({ placeholder = "Search location...", onPlaceChanged, className = "" }) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!window.google) {
      console.error("Google API is not loaded.");
      return;
    }
    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["geocode"],
    });
    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      if (onPlaceChanged) {
        onPlaceChanged(place);
      }
    });
  }, [onPlaceChanged]);

  return (
    <input
      ref={inputRef}
      placeholder={placeholder}
      type="text"
      className = {className}
    />
  );
};

export default LocationSearch;