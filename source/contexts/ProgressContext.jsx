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
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [completedModules, setCompletedModules] = useState(0);
  const [totalModules, setTotalModules] = useState(1);
  const [termsSeen, setTermsSeen] = useState(0);
  const [totalTerms, setTotalTerms] = useState(1);
  const [quizCompleted, setQuizCompleted] = useState(0);
  const [totalQuiz, setTotalQuiz] = useState(1);
  const [streakDays, setStreakDays] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState(0);

  // Subject-specific progress (0-100%)
  const [subjectProgress, setSubjectProgress] = useState({
    anatomy: { progress: 0, modules: 0, icon: '🔬' },
    physiology: { progress: 0, modules: 0, icon: '❤️' },
    pharmacology: { progress: 0, modules: 0, icon: '💊' },
    pathology: { progress: 0, modules: 0, icon: '🔍' },
  });

  // Current learning session
  const [currentLesson, setCurrentLesson] = useState({
    subject: 'ANATOMIE',
    title: 'Système cardiovasculaire',
    lessonNumber: 0,
    totalLessons: 1,
    timeRemaining: 0,
    progress: 0
  });

  // Load from localStorage on mount with error handling
  useEffect(() => {
    try {
      const storedProgress = localStorage.getItem('viclov_progress');
      if (storedProgress) {
        const data = JSON.parse(storedProgress);
        setProgressPercentage(data.progressPercentage ?? 0);
        setAverageScore(data.averageScore ?? 0);
        setCompletedModules(data.completedModules ?? 0);
        setTotalModules(data.totalModules ?? 1);
        setTermsSeen(data.termsSeen ?? 0);
        setTotalTerms(data.totalTerms ?? 1);
        setQuizCompleted(data.quizCompleted ?? 0);
        setTotalQuiz(data.totalQuiz ?? 1);
        setStreakDays(data.streakDays ?? 0);
        setWeeklyProgress(data.weeklyProgress ?? 0);
        if (data.subjectProgress) setSubjectProgress(data.subjectProgress);
        if (data.currentLesson) setCurrentLesson(data.currentLesson);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement de la progression:', error);
      localStorage.removeItem('viclov_progress');
    }
  }, []);

  // Save to localStorage whenever progress changes with error handling
  useEffect(() => {
    try {
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
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde de la progression:', error);
    }
  }, [progressPercentage, averageScore, completedModules, totalModules, termsSeen, totalTerms, quizCompleted, totalQuiz, streakDays, weeklyProgress, subjectProgress, currentLesson]);

  const updateGlobalProgress = (newProgress) => {
    setProgressPercentage(Math.min(100, Math.max(0, newProgress)));
  };

  const updateAverageScore = (newScore) => {
    setAverageScore(Math.min(100, Math.max(0, newScore)));
  };

  const updateCompletedModules = (completed) => {
    setCompletedModules(completed);
    const newProgress = Math.round((completed / totalModules) * 100);
    setProgressPercentage(newProgress);
  };

  const updateSubjectProgress = (subject, progress) => {
    setSubjectProgress(prev => ({
      ...prev,
      [subject]: {
        ...prev[subject],
        progress: Math.min(100, Math.max(0, progress))
      }
    }));
  };

  const updateCurrentLessonProgress = (progress) => {
    setCurrentLesson(prev => ({
      ...prev,
      progress: Math.min(100, Math.max(0, progress))
    }));
  };

  const incrementStreak = () => {
    setStreakDays(prev => prev + 1);
  };

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
