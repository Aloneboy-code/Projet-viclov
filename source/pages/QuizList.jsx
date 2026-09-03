import { useQuery } from "@tanstack/react-query";

import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, BarChart3, Trophy, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { db } from "@/lib/mockData";

const categoryLabels = {
  anatomie: "Anatomie", physiologie: "Physiologie", pharmacologie: "Pharmacologie",
  pathologie: "Pathologie", biochimie: "Biochimie", microbiologie: "Microbiologie",
  neurologie: "Neurologie", cardiologie: "Cardiologie", general: "Général"
};

const difficultyConfig = {
  debutant: { label: "Débutant", color: "bg-green-100 text-green-700" },
  intermediaire: { label: "Intermédiaire", color: "bg-amber-100 text-amber-700" },
  avance: { label: "Avancé", color: "bg-red-100 text-red-700" },
};

export default function QuizList() {
  const { data: quizzes = [], isLoading } = useQuery({
    queryKey: ["quizzes"],
    queryFn: () => db.entities.Quiz.list("title", 100),
  });

  const { data: results = [] } = useQuery({
    queryKey: ["quiz-results"],
    queryFn: () => db.entities.QuizResult.list("-created_date", 100),
  });

  const getQuizBestScore = (quizId) => {
    const qResults = results.filter(r => r.quiz_id === quizId);
    if (qResults.length === 0) return null;
    return Math.max(...qResults.map(r => Math.round((r.score / r.total_questions) * 100)));
  };

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-rose-500 to-red-400 px-6 pt-10 pb-14 md:px-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">🧠 Quiz & Exercices</h1>
          <p className="text-white/70">Testez et renforcez vos connaissances médicales</p>
        </div>
      </div>

      <div className="px-6 md:px-12 -mt-6 pb-12">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="bg-card rounded-2xl h-40 animate-pulse border border-border" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzes.map((quiz, idx) => {
                const best = getQuizBestScore(quiz.id);
                const dConfig = difficultyConfig[quiz.difficulty] || difficultyConfig.debutant;
                return (
                  <motion.div key={quiz.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                    <Link
                      to={`/quiz/${quiz.id}`}
                      className="block bg-card rounded-2xl p-6 border border-border hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <Badge className={dConfig.color}>{dConfig.label}</Badge>
                        <Badge variant="secondary">{categoryLabels[quiz.category] || quiz.category}</Badge>
                      </div>
                      <h3 className="font-semibold text-foreground text-lg mb-2">{quiz.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{quiz.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5" />
                          {quiz.questions?.length || 0} questions
                        </span>
                        {best !== null && (
                          <span className="text-xs font-medium text-amber-600 flex items-center gap-1">
                            <Trophy className="w-3.5 h-3.5" />
                            Meilleur : {best}%
                          </span>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          {!isLoading && quizzes.length === 0 && (
            <div className="text-center py-20">
              <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun quiz disponible</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}