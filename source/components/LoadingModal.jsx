import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const LoadingModal = ({ isOpen, message = "Analyse clinique en cours, veuillez patienter..." }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop flouté */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      {/* Modal de chargement */}
      <div className="relative bg-white dark:bg-[#0F172A] rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border-2 border-[#0A9396]">
        {/* Spinner animé */}
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-[#0A9396] animate-spin" />
            <div className="absolute inset-0 border-4 border-[#005F73]/20 rounded-full animate-pulse" />
          </div>
          
          {/* Texte de chargement */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {message}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Traitement des données médicales...
            </p>
          </div>
          
          {/* Barre de progression animée */}
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#005F73] to-[#0A9396] rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
