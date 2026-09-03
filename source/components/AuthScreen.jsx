import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthScreen = ({ onComplete }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { setEmailAndProfile } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation simple de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    setError('');
    onComplete(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#005F73] to-[#0A9396]">
      <div className="bg-white dark:bg-[#0F172A] p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#005F73] to-[#0A9396] flex items-center justify-center shadow-lg border-2 border-[#0A9396] overflow-hidden">
            <img src="/viclov-logo.jpeg" alt="VicLov" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-[#005F73] dark:text-[#0A9396]">VicLov</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Votre Compagnon Médical</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Adresse email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0A9396] focus:border-transparent bg-white dark:bg-[#1E293B] text-gray-900 dark:text-white"
              required
            />
            {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-[#005F73] hover:bg-[#0A9396] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Continuer
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthScreen;
