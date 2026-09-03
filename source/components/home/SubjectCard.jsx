import { useProgress } from '../../contexts/ProgressContext';

export default function SubjectCard({ subject, data }) {
  const { progress, modules, icon } = data;

  const subjectNames = {
    anatomy: 'Anatomie',
    physiology: 'Physiologie',
    pharmacology: 'Pharmacologie',
    pathology: 'Pathologie'
  };

  const subjectColors = {
    anatomy: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    physiology: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    pharmacology: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    pathology: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
  };

  const progressColors = {
    anatomy: 'bg-blue-600',
    physiology: 'bg-red-600',
    pharmacology: 'bg-green-600',
    pathology: 'bg-purple-600'
  };

  return (
    <div className={`${subjectColors[subject]} border rounded-xl p-4 min-w-[160px] flex-shrink-0`}>
      {/* Icon */}
      <div className="text-3xl mb-3">{icon}</div>
      
      {/* Subject Name */}
      <h4 className="text-gray-900 dark:text-white font-semibold text-sm mb-1">
        {subjectNames[subject]}
      </h4>
      
      {/* Modules Count */}
      <p className="text-gray-600 dark:text-gray-400 text-xs mb-3">
        {modules} modules
      </p>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
        <div
          className={`${progressColors[subject]} rounded-full h-2 transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Progress Percentage */}
      <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">
        {progress}%
      </p>
    </div>
  );
}
