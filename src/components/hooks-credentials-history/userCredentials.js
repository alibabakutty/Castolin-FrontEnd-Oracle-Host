// hooks/useCredentials.js
import { useState, useEffect } from 'react';

export const useCredentials = (role="distributor", baseKey = 'credentials_history') => {
  const key = `${baseKey}_${role}`;
  const [credentialsHistory, setCredentialsHistory] = useState([]);

  // Load credentials from localStorage on mount
  useEffect(() => {
    const loadCredentials = () => {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const history = JSON.parse(stored);
          setCredentialsHistory(history);
        }
      } catch (error) {
        console.error('Error loading credentials:', error);
      }
    };

    loadCredentials();
  }, [key]);

  // Save credentials to localStorage (NO LIMIT - saves all credentials)
  const saveCredentials = (email, password, username = '') => {
    try {
      const newCredential = {
        email,
        password,
        username,
        timestamp: new Date().toISOString()
      };

      // Remove any existing credential with the same email to avoid duplicates
      const updatedHistory = [
        newCredential,
        ...credentialsHistory.filter(cred => cred.email !== email)
      ];

      localStorage.setItem(key, JSON.stringify(updatedHistory));
      setCredentialsHistory(updatedHistory);
    } catch (error) {
      console.error('Error saving credentials:', error);
    }
  };

  // Remove credential from history
  const removeCredential = (email) => {
    try {
      const updatedHistory = credentialsHistory.filter(cred => cred.email !== email);
      localStorage.setItem(key, JSON.stringify(updatedHistory));
      setCredentialsHistory(updatedHistory);
    } catch (error) {
      console.error('Error removing credential:', error);
    }
  };

  // Clear all credentials
  const clearAllCredentials = () => {
    try {
      localStorage.removeItem(key);
      setCredentialsHistory([]);
    } catch (error) {
      console.error('Error clearing credentials:', error);
    }
  };

  return {
    credentialsHistory,
    saveCredentials,
    removeCredential,
    clearAllCredentials
  };
};