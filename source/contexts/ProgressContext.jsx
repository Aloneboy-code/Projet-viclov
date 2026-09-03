import { createContext, useContext, useState, useEffect } from 'react';

const ProgressContext = createContext(null);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export const ProgressProvider = ({ children }) => {
  // Global progress state (0-100%)
  const [progressPercentage, setProgressPercentage] = useState(63);
  const [averageScore, setAverageScore] = useState(78);
  const [completedModules, setCompletedModules] = useState(7);
  const [totalModules, setTotalModules] = useState(11);
  const [termsSeen, setTermsSeen] = useState(1240);
  const [totalTerms, setTotalTerms] = useState(5000);
  const [quizCompleted, setQuizCompleted] = useState(24);
  const [totalQuiz, setTotalQuiz] = useState(30);
  const [streakDays, setStreakDays] = useState(12);
  const [weeklyProgress, setWeeklyProgress] = useState(4);

  // Subject-specific progress (0-100%)
  const [subjectProgress, setSubjectProgress] = useState({
    anatomy: { progress: 45, modules: 8, icon: '🔬' },
    physiology: { progress: 72, modules: 12, icon: '❤️' },
    pharmacology: { progress: 63, modules: 15, icon: '💊' },
    pathology: { progress: 28, modules: 10, icon: '🔍' },
  });

  // Current learning session
  const [currentLesson, setCurrentLesson] = useState({
    subject: 'ANATOMIE',
    title: 'Système cardiovasculaire',
    lessonNumber: 7,
    totalLessons: 11,
    timeRemaining: 45,
    progress: 63
  });

  // Load from localStorage on mount
  useEffect(() => {
    const storedProgress = localStorage.getItem('viclov_progress');
    if (storedProgress) {
      const data = JSON.parse(storedProgress);
      setProgressPercentage(data.progressPercentage || 0);
      setAverageScore(data.averageScore || 0);
      setCompletedModules(data.completedModules || 0);
      setTotalModules(data.totalModules || 1);
      setTermsSeen(data.termsSeen || 0);
      setTotalTerms(data.totalTerms || 1);
      setQuizCompleted(data.quizCompleted || 0);
      setTotalQuiz(data.totalQuiz || 1);
      setStreakDays(data.streakDays || 0);
      setWeeklyProgress(data.weeklyProgress || 0);
      setSubjectProgress(data.subjectProgress || subjectProgress);
      setCurrentLesson(data.currentLesson || currentLesson);
    }
  }, []);

  // Save to localStorage whenever progress changes
  useEffect(() => {
    const data = {
      progressPercentage,
      averageScore,
      completedModules,
      totalModules,
      termsSeen,
      totalTerms,
      quizCompleted,
      totalQuiz,
      streakDays,
      weeklyProgress,
      subjectProgress,
      currentLesson
    };
    localStorage.setItem('viclov_progress', JSON.stringify(data));
  }, [progressPercentage, averageScore, completedModules, totalModules, termsSeen, totalTerms, quizCompleted, totalQuiz, streakDays, weeklyProgress, subjectProgress, currentLesson]);

  // Update global progress percentage
  const updateGlobalProgress = (newProgress) => {
    setProgressPercentage(Math.min(100, Math.max(0, newProgress)));
  };

  // Update average score
  const updateAverageScore = (newScore) => {
    setAverageScore(Math.min(100, Math.max(0, newScore)));
  };

  // Update completed modules
  const updateCompletedModules = (completed) => {
    setCompletedModules(completed);
    // Recalculate global progress based on modules
    const newProgress = Math.round((completed / totalModules) * 100);
    setProgressPercentage(newProgress);
  };

  // Update subject-specific progress
  const updateSubjectProgress = (subject, progress) => {
    setSubjectProgress(prev => ({
      ...prev,
      [subject]: {
        ...prev[subject],
        progress: Math.min(100, Math.max(0, progress))
      }
    }));
  };

  // Update current lesson progress
  const updateCurrentLessonProgress = (progress) => {
    setCurrentLesson(prev => ({
      ...prev,
      progress: Math.min(100, Math.max(0, progress))
    }));
  };

  // Increment streak
  const incrementStreak = () => {
    setStreakDays(prev => prev + 1);
  };

  // Reset streak
  const resetStreak = () => {
    setStreakDays(0);
  };

  const value = {
    progressPercentage,
    averageScore,
    completedModules,
    totalModules,
    termsSeen,
    totalTerms,
    quizCompleted,
    totalQuiz,
    streakDays,
    weeklyProgress,
    subjectProgress,
    currentLesson,
    updateGlobalProgress,
    updateAverageScore,
    updateCompletedModules,
    updateSubjectProgress,
    updateCurrentLessonProgress,
    incrementStreak,
    resetStreak
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};
