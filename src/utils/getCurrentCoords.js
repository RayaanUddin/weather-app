/**
 * Gets the user's current coordinates using Geolocation API.
 * @return {Promise<[{lat: number, lon: number} | null]>}
 */
export const getCurrentCoords = async (): Promise<{ lat: number, lon: number } | null> => {
  console.log("Getting user location...");

  if (!navigator.geolocation) {
    console.log("Geolocation is not supported by this browser.");
    return null; // Return null on failure
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({ lat: position.coords.latitude, lon: position.coords.longitude });
      },
      (error) => {
        console.warn(`Error getting user location: ${error.message}`);
        resolve(null); // Return null on error
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000,
      }
    );
  });
};
