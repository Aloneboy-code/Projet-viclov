import { createContext, useContext, useState, useEffect } from "react";

const CreditsContext = createContext(null);

export const CreditsProvider = ({ children }) => {
  const [credits, setCredits] = useState(() => {
    const saved = localStorage.getItem("viclov_credits");
    return saved ? parseInt(saved, 10) : 5; // 5 crédits gratuits par défaut
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("viclov_credits", credits.toString());
  }, [credits]);

  const deductCredit = () => {
    if (credits > 0) {
      setCredits(prev => prev - 1);
      return true;
    }
    return false;
  };

  const addCredits = (amount) => {
    setCredits(prev => prev + amount);
  };

  const hasCredits = () => credits > 0;

  return (
    <CreditsContext.Provider
      value={{
        credits,
        deductCredit,
        addCredits,
        hasCredits,
        isLoading,
        setIsLoading
      }}
    >
      {children}
    </CreditsContext.Provider>
  );
};

export const useCredits = () => {
  const context = useContext(CreditsContext);
  if (!context) {
    throw new Error("useCredits must be used within CreditsProvider");
  }
  return context;
};
