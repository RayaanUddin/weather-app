import { useState } from "react";

/**
 * Custom hook to handle errors in a React component.
 * @param initialState
 * @param displayDuration
 * @returns {{error: unknown, flashRed: boolean, handleError: handleError}}
 */
export const useErrorHandler = (initialState = null, displayDuration = 10000) => {
  const [error, setError] = useState(initialState);
  const [flashRed, setFlashRed] = useState(false);

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setFlashRed(true);
    setTimeout(() => setFlashRed(false), 1000); // Flash red for 1 second
    setTimeout(() => setError(null), displayDuration); // Hide error message after specified duration
  };

  return { error, flashRed, handleError };
};