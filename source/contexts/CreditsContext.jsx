import { createContext, useContext, useState, useEffect } from 'react';

const CreditsContext = createContext(null);

export const useCredits = () => {
  const context = useContext(CreditsContext);
  if (!context) {
    throw new Error('useCredits must be used within a CreditsProvider');
  }
  return context;
};

export const CreditsProvider = ({ children }) => {
  const [credits, setCredits] = useState(() => {
    try {
      const stored = localStorage.getItem('viclov_credits');
      return stored ? parseInt(stored, 10) : 20;
    } catch (error) {
      console.error('❌ Erreur lors du chargement des crédits:', error);
      return 20;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('viclov_credits', credits.toString());
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde des crédits:', error);
    }
  }, [credits]);

  const deductCredit = () => {
    setCredits(prev => Math.max(0, prev - 1));
  };

  const addCredits = (amount) => {
    setCredits(prev => prev + amount);
  };

  const hasCredits = () => credits > 0;

  const value = {
    credits,
    deductCredit,
    addCredits,
    hasCredits
  };

  return <CreditsContext.Provider value={value}>{children}</CreditsContext.Provider>;
};
