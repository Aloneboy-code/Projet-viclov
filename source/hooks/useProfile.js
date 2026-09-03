import { useState, useEffect } from 'react';

// Types de profil disponibles
export const PROFILE_TYPES = {
  SIMPLE_USER: 'simple_user',
  MEDICAL_LEARNER: 'medical_learner'
};

// Routes accessibles par profil
export const PROFILE_ACCESS = {
  [PROFILE_TYPES.SIMPLE_USER]: ['/pharmacologie'], // Accès UNIQUEMENT à Pharmacologie
  [PROFILE_TYPES.MEDICAL_LEARNER]: ['/'] // Accès illimité
};

export function useProfile() {
  const [email, setEmail] = useState(() => {
    const stored = localStorage.getItem('viclov_email');
    return stored || '';
  });

  const [profile, setProfile] = useState(() => {
    const stored = localStorage.getItem('viclov_profile');
    return stored || null;
  });

  const [showEmailScreen, setShowEmailScreen] = useState(!localStorage.getItem('viclov_email'));
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (email) {
      localStorage.setItem('viclov_email', email);
    }
  }, [email]);

  useEffect(() => {
    if (profile) {
      localStorage.setItem('viclov_profile', profile);
    }
  }, [profile]);

  const setEmailAddress = (emailAddress) => {
    setEmail(emailAddress);
    setShowEmailScreen(false);
    setShowProfileModal(true);
  };

  const setProfileType = (type) => {
    setProfile(type);
    setShowProfileModal(false);
  };

  const hasAccess = (path) => {
    if (!profile) return false;
    
    if (profile === PROFILE_TYPES.MEDICAL_LEARNER) {
      return true; // Accès illimité pour les apprenants
    }
    
    // Pour les utilisateurs simples, accès UNIQUEMENT à Pharmacologie
    const allowedRoutes = PROFILE_ACCESS[PROFILE_TYPES.SIMPLE_USER];
    return allowedRoutes.includes(path) || path.startsWith('/pharmacologie');
  };

  const isMedicalLearner = () => profile === PROFILE_TYPES.MEDICAL_LEARNER;
  const isIdentified = () => !!email && !!profile;

  return {
    email,
    profile,
    setEmailAddress,
    setProfileType,
    hasAccess,
    isMedicalLearner,
    isIdentified,
    showEmailScreen,
    showProfileModal,
    setShowProfileModal
  };
}
