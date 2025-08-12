import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      console.log('📱 Loading session from AsyncStorage...');
      const storedSession = await AsyncStorage.getItem('userSession');
      
      if (storedSession) {
        const parsedSession = JSON.parse(storedSession);
        console.log('✅ Session loaded successfully:', parsedSession);
        setSession(parsedSession);
      } else {
        console.log('❌ No session found in storage');
        setSession(null);
      }
    } catch (error) {
      console.error('❌ Failed to load session:', error);
      setSession(null);
    } finally {
      setIsSessionLoaded(true);
    }
  };

  const saveSession = async (data) => {
    try {
      console.log('💾 Saving session to AsyncStorage:', data);
      await AsyncStorage.setItem('userSession', JSON.stringify(data));
      setSession(data);
      console.log('✅ Session saved successfully');
    } catch (error) {
      console.error('❌ Failed to save session:', error);
    }
  };

  const getUserId = async () => {
    try {
      const sessionValue = await AsyncStorage.getItem('userSession');
      if (sessionValue !== null) {
        const session = JSON.parse(sessionValue);
        return session.id;
      }
      return null;
    } catch (e) {
      console.error('Failed to get user ID:', e);
      return null;
    }
  };

  const getUserMobile = async () => {
    try {
      const sessionValue = await AsyncStorage.getItem('userSession');
      if (sessionValue !== null) {
        const session = JSON.parse(sessionValue);
        return session.mobile;
      }
      return null;
    } catch (e) {
      console.error('Failed to get user mobile:', e);
      return null;
    }
  };

  const getUserName = async () => {
    try {
      const sessionValue = await AsyncStorage.getItem('userSession');
      if (sessionValue !== null) {
        const session = JSON.parse(sessionValue);
        return session.name;
      }
      return null;
    } catch (e) {
      console.error('Failed to get user name:', e);
      return null;
    }
  };

  const getUserEmail = async () => {
    try {
      const sessionValue = await AsyncStorage.getItem('userSession');
      if (sessionValue !== null) {
        const session = JSON.parse(sessionValue);
        return session.email;
      }
      return null;
    } catch (e) {
      console.error('Failed to get user email:', e);
      return null;
    }
  };

  const getUserType = async () => {
    try {
      const sessionValue = await AsyncStorage.getItem('userSession');
      if (sessionValue !== null) {
        const session = JSON.parse(sessionValue);
        return session.type;
      }
      return null;
    } catch (e) {
      console.error('Failed to get user type:', e);
      return null;
    }
  };

   const getSecondaryMobile = async () => {
    try {
      const sessionValue = await AsyncStorage.getItem('userSession');
      if (sessionValue !== null) {
        const session = JSON.parse(sessionValue);
        return session.sec_mobile;
      }
      return null;
    } catch (e) {
      console.error('Failed to get sec_mobile:', e);
      return null;
    }
  };

  const clearSession = async () => {
    try {
      console.log('🗑️ Clearing session...');
      await AsyncStorage.removeItem('userSession');
      setSession(null);
      console.log('✅ Session cleared successfully');
    } catch (error) {
      console.error('❌ Failed to clear session:', error);
    }
  };

  // Helper function to check if user is logged in
  const isLoggedIn = () => {
    return session && session.id;
  };

  // Helper function to get current session without async
  const getCurrentSession = () => {
    return session;
  };

  return (
    <SessionContext.Provider 
      value={{ 
        session, 
        isSessionLoaded,
        loadSession,
        saveSession, 
        clearSession, 
        getUserId, 
        getUserName, 
        getUserEmail,
        getUserMobile,
        getUserType,
        isLoggedIn,
        getCurrentSession
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};