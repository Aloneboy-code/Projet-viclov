// Import des données depuis les fichiers séparés
import { mockCourses } from '../data/courses.js';
import { mockQuizzes } from '../data/quizzes.js';
import { getMedicalTerms } from '../data/medicalTerms.js';
import { getMedications } from '../data/medications.js';
import { mockReviews } from '../data/reviews.js';

export const quizResults = [];

// API functions
export const db = {
  entities: {
    Course: {
      list: async (sortBy = "order", limit = 100) => {
        return mockCourses;
      },
      get: async (id) => {
        return mockCourses.find(c => c.id === id);
      }
    },
    Quiz: {
      list: async (sortBy = "title", limit = 100) => {
        return mockQuizzes;
      },
      get: async (id) => {
        return mockQuizzes.find(q => q.id === id);
      }
    },
    QuizResult: {
      list: async (sortBy = "-created_date", limit = 100) => {
        return quizResults;
      },
      create: async (data) => {
        const newResult = { ...data, id: Date.now().toString(), created_date: new Date().toISOString() };
        quizResults.push(newResult);
        return newResult;
      }
    },
    Review: {
      list: async (sortBy = "-created_date", limit = 50) => {
        return mockReviews;
      },
      create: async (data) => {
        const newReview = { ...data, id: Date.now().toString(), created_date: new Date().toISOString() };
        mockReviews.push(newReview);
        return newReview;
      }
    },
    MedicalTerm: {
      list: async (sortBy = "term", limit = 20000) => {
        return getMedicalTerms();
      }
    },
    Medication: {
      list: async (sortBy = "name", limit = 35000) => {
        return getMedications();
      }
    }
  },
  agents: {
    subscribeToConversation: () => () => {},
    listConversations: async () => [],
    createConversation: async () => ({ id: "1", messages: [] }),
    getConversation: async () => ({ id: "1", messages: [] }),
    addMessage: async () => {}
  },
  integrations: {
    Core: {
      SendEmail: async () => {}
    }
  }
};
