import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Initialize auth state synchronously to prevent flash
const getInitialAuthState = () => {
  try {
    const storedEmail = localStorage.getItem('viclov_email');
    const storedProfile = localStorage.getItem('viclov_profile');
    
    if (storedEmail && storedProfile) {
      return {
        email: storedEmail,
        profile: storedProfile,
        isAuthenticated: true
      };
    }
  } catch (e) {
    console.error('Failed to read auth state from localStorage:', e);
  }
  
  return {
    email: null,
    profile: null,
    isAuthenticated: false
  };
};

export const AuthProvider = ({ children }) => {
  const initialState = getInitialAuthState();
  const [email, setEmail] = useState(initialState.email);
  const [profile, setProfile] = useState(initialState.profile);
  const [isAuthenticated, setIsAuthenticated] = useState(initialState.isAuthenticated);

  const setEmailAndProfile = (newEmail, newProfile) => {
    setEmail(newEmail);
    setProfile(newProfile);
    setIsAuthenticated(true);
    
    // Sauvegarder dans localStorage (VERROUILLAGE DÉFINITIF)
    localStorage.setItem('viclov_email', newEmail);
    localStorage.setItem('viclov_profile', newProfile);
  };

  const logout = () => {
    setEmail(null);
    setProfile(null);
    setIsAuthenticated(false);
    localStorage.removeItem('viclov_email');
    localStorage.removeItem('viclov_profile');
  };

  const value = {
    email,
    profile,
    isAuthenticated,
    setEmailAndProfile,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
