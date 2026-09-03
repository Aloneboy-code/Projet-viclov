import { Play } from 'lucide-react';
import { useProgress } from '../../contexts/ProgressContext';
import { Link } from 'react-router-dom';

export default function ContinueLearningCard() {
  const { currentLesson, updateCurrentLessonProgress } = useProgress();
  const { subject, title, lessonNumber, totalLessons, timeRemaining, progress } = currentLesson;

  return (
    <div className="bg-blue-600 rounded-2xl p-5 shadow-lg">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {subject}
        </span>
        <span className="text-white/80 text-xs flex items-center gap-1">
          ⏱ {timeRemaining} min restantes
        </span>
      </div>

      {/* Title & Details */}
      <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
      <p className="text-white/70 text-sm mb-4">
        Leçon {lessonNumber}/{totalLessons}
      </p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/80 text-xs">Progression</span>
          <span className="text-white font-semibold text-sm">{progress}% complété</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="bg-white rounded-full h-2 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Action Button */}
      <Link
        to="/cours"
        className="w-full bg-white text-blue-600 rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
      >
        <Play className="w-5 h-5" />
        {progress === 0 ? 'Commencer' : 'Reprendre'}
      </Link>
    </div>
  );
}
