import { useState, useEffect, useCallback } from 'react';

// Custom event name for intra-tab state synchronization
const SYNC_EVENT = 'grd_local_storage_sync';

/**
 * Custom hook for persistent state backed by localStorage with instant cross-component synchronization.
 * @param {string} key - Unique key in localStorage
 * @param {any} initialValue - Fallback initial value
 */
export function usePersistentState(key, initialValue) {
  // Read value from localStorage or fallback
  const readValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item);
      }
    } catch (error) {
      console.warn(`[usePersistentState] Error reading localStorage key "${key}":`, error);
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState(readValue);

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = useCallback((value) => {
    if (typeof window === 'undefined') {
      console.warn(`[usePersistentState] localStorage not available`);
      return;
    }

    try {
      setStoredValue((current) => {
        const valueToStore = typeof value === 'function' ? value(current) : value;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));

        // Dispatch a custom event so other components in the same window/tab update immediately
        window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key, value: valueToStore } }));

        return valueToStore;
      });
    } catch (error) {
      console.warn(`[usePersistentState] Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  // Listen for changes from other tabs (via native 'storage' event) and same tab (via SYNC_EVENT)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (err) {
          console.warn(`[usePersistentState] Error parsing storage event value for "${key}":`, err);
        }
      }
    };

    const handleCustomSync = (e) => {
      if (e.detail?.key === key) {
        setStoredValue(e.detail.value);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(SYNC_EVENT, handleCustomSync);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(SYNC_EVENT, handleCustomSync);
    };
  }, [key]);

  return [storedValue, setValue];
}

/**
 * Utility to clear all custom GRD Pharma data and reset to initial seed data
 */
export function clearAllPersistentData() {
  if (typeof window === 'undefined') return;
  const keysToRemove = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith('grd_')) {
      keysToRemove.push(k);
    }
  }
  keysToRemove.forEach(k => window.localStorage.removeItem(k));
  window.dispatchEvent(new Event(SYNC_EVENT));
}
