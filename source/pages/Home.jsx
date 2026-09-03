import Header from '../components/home/Header';
import ProgressCard from '../components/home/ProgressCard';
import ContinueLearningCard from '../components/home/ContinueLearningCard';
import SubjectCard from '../components/home/SubjectCard';
import BottomNavigation from '../components/home/BottomNavigation';
import { useProgress } from '../contexts/ProgressContext';
import { Link } from 'react-router-dom';

export default function Home() {
  const { subjectProgress } = useProgress();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F172A] pb-20">
      {/* Header */}
      <Header />

      <div className="px-4 py-4 space-y-4">
        {/* Progress Section (2x2 Grid) */}
        <ProgressCard />

        {/* Continue Learning Card */}
        <ContinueLearningCard />

        {/* Subjects Section (Horizontal Carousel) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900 dark:text-white font-semibold text-base">Matières</h2>
            <Link to="/cours" className="text-blue-600 dark:text-blue-400 text-sm font-medium">
              Voir tout
            </Link>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {Object.entries(subjectProgress).map(([subject, data]) => (
              <SubjectCard key={subject} subject={subject} data={data} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}