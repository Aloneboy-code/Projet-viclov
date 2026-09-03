import { TrendingUp, Trophy, BookOpen, CheckCircle2 } from 'lucide-react';
import { useProgress } from '../../contexts/ProgressContext';

export default function ProgressCard() {
  const { 
    progressPercentage, 
    averageScore, 
    termsSeen, 
    totalTerms, 
    quizCompleted, 
    totalQuiz, 
    weeklyProgress 
  } = useProgress();

  const stats = [
    {
      title: 'Progression globale',
      value: `${progressPercentage}%`,
      icon: TrendingUp,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      badge: `+${weeklyProgress}% cette semaine`,
      badgeColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Score moyen',
      value: `${averageScore}/100`,
      icon: Trophy,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      badge: '+5 points',
      badgeColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Termes vus',
      value: `${termsSeen.toLocaleString()} / ${totalTerms.toLocaleString()}`,
      icon: BookOpen,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      badge: 'total',
      badgeColor: 'text-gray-500 dark:text-gray-400'
    },
    {
      title: 'Quiz réussis',
      value: `${quizCompleted}/${totalQuiz}`,
      icon: CheckCircle2,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      badge: `${totalQuiz - quizCompleted} en attente`,
      badgeColor: 'text-orange-600 dark:text-orange-400'
    }
  ];

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-4 shadow-sm">
      <h2 className="text-gray-900 dark:text-white font-semibold text-base mb-4">Votre progression</h2>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} rounded-xl p-4 flex flex-col gap-2`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                <span className={`text-xs font-medium ${stat.badgeColor}`}>
                  {stat.badge}
                </span>
              </div>
              <p className="text-gray-900 dark:text-white text-2xl font-bold">{stat.value}</p>
              <p className="text-gray-600 dark:text-gray-400 text-xs">{stat.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
