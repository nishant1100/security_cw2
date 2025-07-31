import React, { createContext, useContext } from 'react';
import useSession from '../utils/useSession';

// Create the session context
const SessionContext = createContext();

// Session provider component
export const SessionProvider = ({ children }) => {
  const session = useSession();

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};

// Custom hook to use session context
export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
};

export default SessionContext; 