import { Flame, Bell, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useProgress } from '../../contexts/ProgressContext';

export default function Header() {
  const { profile } = useAuth();
  const { streakDays } = useProgress();

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  // Get user display name
  const getUserName = () => {
    if (profile === 'medical_learner') return 'Dr. Amara';
    return 'Étudiant';
  };

  return (
    <div className="bg-white dark:bg-[#1E293B] px-4 py-4 flex items-center justify-between">
      {/* Left: Branding */}
      <div className="flex items-center gap-3">
        {/* Logo with blue background and white medical cross */}
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="2" width="4" height="20" rx="1" fill="white"/>
            <rect x="2" y="10" width="20" height="4" rx="1" fill="white"/>
          </svg>
        </div>
        <div>
          <h1 className="text-gray-900 dark:text-white font-bold text-lg">VicLov</h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs">
            {getGreeting()}, {getUserName()} 👋
          </p>
        </div>
      </div>

      {/* Right: Badges & Profile */}
      <div className="flex items-center gap-3">
        {/* Streak Badge */}
        <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-orange-600 dark:text-orange-400 text-xs font-semibold">{streakDays}</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </div>

        {/* Profile Photo */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}
