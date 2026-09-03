import { Home, BookOpen, Activity, Pill, HelpCircle } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

export default function BottomNavigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Accueil', icon: Home },
    { path: '/cours', label: 'Cours', icon: BookOpen },
    { path: '/anatomie', label: 'Anatomie', icon: Activity },
    { path: '/pharmacologie', label: 'Pharma', icon: Pill },
    { path: '/quiz', label: 'Quiz', icon: HelpCircle },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1E293B] border-t border-gray-200 dark:border-gray-700 px-2 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
