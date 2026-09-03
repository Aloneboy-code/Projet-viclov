import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, XCircle, ArrowRight, Trophy, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/mockData";

export default function QuizPlay() {
  const quizId = window.location.pathname.split("/").pop();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const queryClient = useQueryClient();

  const { data: quizzes = [], isLoading } = useQuery({
    queryKey: ["quiz-play", quizId],
    queryFn: () => db.entities.Quiz.list(),
  });

  const quiz = quizzes.find(q => q.id === quizId);
  const questions = quiz?.questions || [];
  const question = questions[currentQ];

  const saveMutation = useMutation({
    mutationFn: (data) => db.entities.QuizResult.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["quiz-results"] }),
  });

  const handleSelect = (idx) => {
    if (showAnswer) return;
    setSelected(idx);
    setShowAnswer(true);
    const isCorrect = idx === question.correct_answer;
    setAnswers(prev => [...prev, { question_index: currentQ, selected: idx, correct: isCorrect }]);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelected(null);
      setShowAnswer(false);
    } else {
      const score = answers.filter(a => a.correct).length;
      saveMutation.mutate({
        quiz_id: quizId,
        score,
        total_questions: questions.length,
        answers,
        completed_at: new Date().toISOString(),
      });
      setFinished(true);
    }
  };

  const restart = () => {
    setCurrentQ(0);
    setSelected(null);
    setShowAnswer(false);
    setAnswers([]);
    setFinished(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Quiz non trouvé</p>
        <Link to="/quiz" className="text-primary hover:underline">← Retour</Link>
      </div>
    );
  }

  const score = answers.filter(a => a.correct).length;
  const percentage = Math.round((score / questions.length) * 100);

  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-card rounded-3xl border border-border p-8 max-w-md w-full text-center shadow-xl"
        >
          <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
            percentage >= 70 ? "bg-green-100" : percentage >= 40 ? "bg-amber-100" : "bg-red-100"
          }`}>
            <Trophy className={`w-10 h-10 ${
              percentage >= 70 ? "text-green-600" : percentage >= 40 ? "text-amber-600" : "text-red-600"
            }`} />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Quiz terminé !</h2>
          <p className="text-4xl font-bold text-primary mb-2">{percentage}%</p>
          <p className="text-muted-foreground mb-6">{score} / {questions.length} bonnes réponses</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={restart} className="gap-2">
              <RotateCcw className="w-4 h-4" /> Recommencer
            </Button>
            <Link to="/quiz">
              <Button className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Autres quiz
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link to="/quiz" className="text-muted-foreground hover:text-foreground flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Quitter
          </Link>
          <span className="text-sm text-muted-foreground font-medium">{currentQ + 1} / {questions.length}</span>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-muted rounded-full mb-8">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-xl font-bold text-foreground mb-6">{question?.question}</h2>

            <div className="space-y-3">
              {question?.options?.map((opt, idx) => {
                const isCorrect = idx === question.correct_answer;
                const isSelected = selected === idx;
                let style = "bg-card border-border hover:border-primary/50 hover:shadow-sm";
                if (showAnswer) {
                  if (isCorrect) style = "bg-green-50 border-green-400 text-green-800";
                  else if (isSelected) style = "bg-red-50 border-red-400 text-red-800";
                  else style = "bg-card border-border opacity-50";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={showAnswer}
                    className={`w-full text-left rounded-xl p-4 border-2 transition-all flex items-center gap-3 ${style}`}
                  >
                    <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0 border-current">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm font-medium">{opt}</span>
                    {showAnswer && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto" />}
                    {showAnswer && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600 ml-auto" />}
                  </button>
                );
              })}
            </div>

            {showAnswer && question?.explanation && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4"
              >
                <p className="text-sm text-blue-800"><strong>Explication :</strong> {question.explanation}</p>
              </motion.div>
            )}

            {showAnswer && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 flex justify-end">
                <Button onClick={handleNext} className="gap-2">
                  {currentQ < questions.length - 1 ? (
                    <>Suivante <ArrowRight className="w-4 h-4" /></>
                  ) : (
                    <>Voir les résultats <Trophy className="w-4 h-4" /></>
                  )}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}