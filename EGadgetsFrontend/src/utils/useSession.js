import { useState, useEffect, useCallback, useRef } from 'react';
import Cookies from 'js-cookie';

const useSession = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const inactivityTimerRef = useRef(null);
  const activityListenersRef = useRef([]);

  // Constants
  const INACTIVITY_TIMEOUT = 1 * 60 * 1000; // 1 minute for testing
  const TOKEN_KEY = 'authToken';
  const USER_KEY = 'user';
  const SESSION_KEY = 'sessionId';
  const TOKEN_EXPIRY_KEY = 'tokenExpiry';

  // Check if session is valid
  const checkSessionValidity = useCallback(() => {
    try {
      const storedUser = localStorage.getItem(USER_KEY);
      const tokenExpiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
      
      if (!storedUser || !tokenExpiry) {
        return false;
      }

      if (new Date() > new Date(tokenExpiry)) {
        clearSession();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking session validity:', error);
      return false;
    }
  }, []);

  // Load session from storage
  const loadSession = useCallback(() => {
    try {
      if (checkSessionValidity()) {
        const storedUser = JSON.parse(localStorage.getItem(USER_KEY));
        setUser(storedUser);
        setIsAuthenticated(true);
        setIsAdmin(storedUser?.role === 'admin');
        startInactivityTimer();
        return true;
      } else {
        clearSession();
        return false;
      }
    } catch (error) {
      console.error('Error loading session:', error);
      clearSession();
      return false;
    }
  }, [checkSessionValidity]);

  // Set session
  const setSession = useCallback((token, userData) => {
    try {
      // Store user data
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      
      // Set token expiry (24 hours)
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 24);
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toISOString());
      
      // Store token in cookie
      Cookies.set(TOKEN_KEY, token, {
        expires: 1, // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(userData?.role === 'admin');

      // Start inactivity timer
      startInactivityTimer();

      console.log('Session set successfully');
      return true;
    } catch (error) {
      console.error('Error setting session:', error);
      return false;
    }
  }, []);

  // Clear session
  const clearSession = useCallback(() => {
    try {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
      Cookies.remove(TOKEN_KEY);
      Cookies.remove(SESSION_KEY);
      
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      
      clearInactivityTimer();
      
      console.log('Session cleared successfully');
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }, []);

  // Get auth token
  const getAuthToken = useCallback(() => {
    return Cookies.get(TOKEN_KEY);
  }, []);

  // Handle inactivity logout
  const handleInactivityLogout = useCallback(() => {
    clearSession();
    window.location.href = '/login';
    alert('You have been logged out due to inactivity.');
  }, [clearSession]);

  // Start inactivity timer
  const startInactivityTimer = useCallback(() => {
    clearInactivityTimer();
    
    if (!isAuthenticated) return;

    inactivityTimerRef.current = setTimeout(() => {
      handleInactivityLogout();
    }, INACTIVITY_TIMEOUT);

    setupActivityListeners();
  }, [isAuthenticated, handleInactivityLogout]);

  // Clear inactivity timer
  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    removeActivityListeners();
  }, []);

  // Reset inactivity timer on user activity
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    
    if (isAuthenticated) {
      inactivityTimerRef.current = setTimeout(() => {
        handleInactivityLogout();
      }, INACTIVITY_TIMEOUT);
    }
  }, [isAuthenticated, handleInactivityLogout]);

  // Setup activity listeners
  const setupActivityListeners = useCallback(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      const handler = () => resetInactivityTimer();
      document.addEventListener(event, handler, true);
      activityListenersRef.current.push({ event, handler });
    });
  }, [resetInactivityTimer]);

  // Remove activity listeners
  const removeActivityListeners = useCallback(() => {
    activityListenersRef.current.forEach(({ event, handler }) => {
      document.removeEventListener(event, handler, true);
    });
    activityListenersRef.current = [];
  }, []);

  // Check session on page load
  const checkSessionOnLoad = useCallback(() => {
    if (!checkSessionValidity()) {
      // Only redirect to /login if trying to access /dashboard (not /admin)
      if (window.location.pathname.startsWith('/dashboard')) {
        window.location.href = '/login';
      }
      // Do NOT redirect if on /admin (allow access to admin login page)
    } else {
      loadSession();
    }
  }, [checkSessionValidity, loadSession]);

  // Initialize session on mount
  useEffect(() => {
    loadSession();
    
    // Check session on page load
    checkSessionOnLoad();

    // Cleanup on unmount
    return () => {
      clearInactivityTimer();
    };
  }, [loadSession, checkSessionOnLoad, clearInactivityTimer]);

  return {
    user,
    isAuthenticated,
    isAdmin,
    setSession,
    clearSession,
    getAuthToken,
    checkSessionValidity,
    loadSession,
    checkSessionOnLoad
  };
};

export default useSession; 