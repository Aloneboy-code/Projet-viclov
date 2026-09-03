import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Charger les données depuis localStorage au démarrage
    const storedEmail = localStorage.getItem('viclov_email');
    const storedProfile = localStorage.getItem('viclov_profile');
    
    if (storedEmail && storedProfile) {
      setEmail(storedEmail);
      setProfile(storedProfile);
      setIsAuthenticated(true);
    }
  }, []);

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
