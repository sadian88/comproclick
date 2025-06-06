
// src/hooks/useLocalStorage.ts
"use client";

import { useState, useEffect, Dispatch, SetStateAction } from 'react';

type SetValue<T> = Dispatch<SetStateAction<T>>;

function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  // Lazy state initialization: read from localStorage only on initial client render
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      // Return initialValue during SSR or if window is not available
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.warn(`Error reading localStorage key "${key}" on init:`, error);
      return initialValue;
    }
  });

  // useEffect to update localStorage when the 'storedValue' state changes or 'key' changes.
  // This effect runs on the client after the initial render and whenever key/storedValue changes.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // If initialValue was used by useState (because item wasn't in localStorage),
        // then storedValue will be initialValue, and this effect will write it to localStorage.
        // If localStorage had an item, storedValue is that item, and this writes it back (idempotent if unchanged).
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    }
  }, [key, storedValue]); // Only re-run if key or storedValue changes

  const setValue: SetValue<T> = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      // Persisting to localStorage is handled by the useEffect above
    } catch (error) {
       console.warn(`Error setting state for localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
