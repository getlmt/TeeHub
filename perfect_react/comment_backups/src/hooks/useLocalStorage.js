import { useState, useEffect, useCallback } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

// Hook for managing multiple localStorage keys
export const useLocalStorageMulti = (keys) => {
  const [values, setValues] = useState({});

  useEffect(() => {
    const initialValues = {};
    keys.forEach(key => {
      try {
        const item = window.localStorage.getItem(key);
        initialValues[key] = item ? JSON.parse(item) : null;
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        initialValues[key] = null;
      }
    });
    setValues(initialValues);
  }, [keys]);

  const setValue = useCallback((key, value) => {
    try {
      const valueToStore = value instanceof Function ? value(values[key]) : value;
      setValues(prev => ({ ...prev, [key]: valueToStore }));
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [values]);

  const removeValue = useCallback((key) => {
    try {
      window.localStorage.removeItem(key);
      setValues(prev => ({ ...prev, [key]: null }));
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, []);

  const clearAll = useCallback(() => {
    try {
      keys.forEach(key => {
        window.localStorage.removeItem(key);
      });
      setValues({});
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }, [keys]);

  return { values, setValue, removeValue, clearAll };
};
