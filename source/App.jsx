import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';

import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoadingProvider } from './contexts/LoadingContext';
import { CreditsProvider } from './contexts/CreditsContext';
import { ProgressProvider } from './contexts/ProgressContext';

import Layout from './components/Layout';
import AuthScreen from './components/AuthScreen';
import ProfileSelection from './components/ProfileSelection';
import LoadingModal from './components/LoadingModal';

import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Anatomy from './pages/Anatomie';
import Pharmacology from './pages/Pharmacologie';
import Dictionary from './pages/Dictionnaire';
import QuizList from './pages/QuizList';
import QuizPlay from './pages/QuizPlay';
import AITutor from './pages/AITutor';
import Reviews from './pages/Reviews';
import Favorites from './pages/Favorites';
import Chat from './pages/Chat';

import { useAuth } from './contexts/AuthContext';
import { useLoading } from './contexts/LoadingContext';

const ProtectedRoute = ({ children, allowedProfiles }) => {
  const { isAuthenticated, profile } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedProfiles && !allowedProfiles.includes(profile)) {
    return <Navigate to="/pharmacologie" replace />;
  }
  
  return children;
};

const AppContent = () => {
  const { isAuthenticated, profile } = useAuth();
  const { isLoading, loadingMessage } = useLoading();
  const [authStep, setAuthStep] = useState('email');

  useEffect(() => {
    if (isAuthenticated) {
      setAuthStep('done');
    }
  }, [isAuthenticated]);

  const handleEmailSubmit = (email) => {
    setAuthStep('profile');
  };

  if (authStep === 'email') {
    return <AuthScreen onComplete={handleEmailSubmit} />;
  }

  if (authStep === 'profile') {
    return <ProfileSelection />;
  }

  return (
    <>
      <LoadingModal isOpen={isLoading} message={loadingMessage} />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={
            <ProtectedRoute allowedProfiles={['medical_learner']}>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/cours" element={
            <ProtectedRoute allowedProfiles={['medical_learner']}>
              <Courses />
            </ProtectedRoute>
          } />
          <Route path="/cours/:id" element={
            <ProtectedRoute allowedProfiles={['medical_learner']}>
              <CourseDetail />
            </ProtectedRoute>
          } />
          <Route path="/anatomie" element={
            <ProtectedRoute allowedProfiles={['medical_learner']}>
              <Anatomy />
            </ProtectedRoute>
          } />
          <Route path="/pharmacologie" element={<Pharmacology />} />
          <Route path="/dictionnaire" element={
            <ProtectedRoute allowedProfiles={['medical_learner']}>
              <Dictionary />
            </ProtectedRoute>
          } />
          <Route path="/quiz" element={
            <ProtectedRoute allowedProfiles={['medical_learner']}>
              <QuizList />
            </ProtectedRoute>
          } />
          <Route path="/quiz/:id" element={
            <ProtectedRoute allowedProfiles={['medical_learner']}>
              <QuizPlay />
            </ProtectedRoute>
          } />
          <Route path="/ia" element={<AITutor />} />
          <Route path="/avis" element={
            <ProtectedRoute allowedProfiles={['medical_learner']}>
              <Reviews />
            </ProtectedRoute>
          } />
          <Route path="/favoris" element={
            <ProtectedRoute allowedProfiles={['medical_learner']}>
              <Favorites />
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute allowedProfiles={['medical_learner']}>
              <Chat />
            </ProtectedRoute>
          } />
        </Route>
        <Route path="/login" element={<AuthScreen onComplete={handleEmailSubmit} />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LoadingProvider>
          <CreditsProvider>
            <ProgressProvider>
              <QueryClientProvider client={queryClientInstance}>
                <Router>
                  <AppContent />
                </Router>
                <Toaster />
              </QueryClientProvider>
            </ProgressProvider>
          </CreditsProvider>
        </LoadingProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App