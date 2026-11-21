// useSyncStatus.js - Low-Bandwidth & Offline Sync State Simulation
import React, { createContext, useContext, useState, useEffect } from 'react';

const SyncContext = createContext(null);

export function SyncProvider({ children }) {
  const [syncState, setSyncState] = useState('online'); // 'online' | 'offline' | 'syncing'
  const [lastSyncTime, setLastSyncTime] = useState('Just Now');
  const [pendingQueueCount, setPendingQueueCount] = useState(0);

  const toggleOffline = () => {
    if (syncState === 'offline') {
      triggerSync();
    } else {
      setSyncState('offline');
      setPendingQueueCount(3); // Simulated 3 offline transactions queued
    }
  };

  const triggerSync = () => {
    setSyncState('syncing');
    setTimeout(() => {
      setSyncState('online');
      setPendingQueueCount(0);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1800);
  };

  return (
    <SyncContext.Provider value={{ syncState, lastSyncTime, pendingQueueCount, toggleOffline, triggerSync }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSyncStatus() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSyncStatus must be used within a SyncProvider');
  }
  return context;
}
