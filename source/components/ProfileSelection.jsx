import { useAuth } from '../contexts/AuthContext';

const ProfileSelection = ({ email }) => {
  const { setEmailAndProfile } = useAuth();

  const handleProfileSelect = (profile) => {
    setEmailAndProfile(email, profile);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#005F73] to-[#0A9396]">
      <div className="bg-white dark:bg-[#0F172A] p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#005F73] to-[#0A9396] flex items-center justify-center shadow-lg border-2 border-[#0A9396] overflow-hidden">
            <img src="/viclov-logo.jpeg" alt="VicLov" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-[#005F73] dark:text-[#0A9396]">VicLov</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Choisissez votre profil</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleProfileSelect('simple_user')}
            className="w-full bg-white dark:bg-[#1E293B] border-2 border-[#005F73] hover:bg-[#005F73] hover:text-white text-[#005F73] dark:text-[#0A9396] font-semibold py-4 px-6 rounded-lg transition-all duration-200"
          >
            Simple Utilisateur
          </button>

          <button
            onClick={() => handleProfileSelect('medical_learner')}
            className="w-full bg-white dark:bg-[#1E293B] border-2 border-[#0A9396] hover:bg-[#0A9396] hover:text-white text-[#0A9396] dark:text-[#0A9396] font-semibold py-4 px-6 rounded-lg transition-all duration-200"
          >
            Apprenant en Médecine
          </button>
        </div>

        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6">
          Ce choix est définitif
        </p>
      </div>
    </div>
  );
};

export default ProfileSelection;
