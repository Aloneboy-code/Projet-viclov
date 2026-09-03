import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { motion } from "framer-motion";
import { BookOpen, HelpCircle, TrendingUp, Award, Target, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { db } from "@/lib/mockData";

function RadialProgress({ value, size = 72, stroke = 7, color = "hsl(var(--primary))" }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
    </svg>
  );
}

function StatCard({ icon: Icon, label, value, sub, color, to }) {
  const inner = (
    <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold text-foreground leading-tight">{value}</p>
        {sub && <p className="text-xs text-muted-foreground truncate">{sub}</p>}
      </div>
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

const categoryLabels = {
  anatomie: "Anatomie", physiologie: "Physiologie", biochimie: "Biochimie",
  microbiologie: "Microbiologie", pathologie: "Pathologie", pharmacologie: "Pharmacologie",
  histologie: "Histologie", embryologie: "Embryologie", neurologie: "Neurologie",
  cardiologie: "Cardiologie", general: "Général",
};

export default function ProgressDashboard() {
  const { favorites } = useFavorites();

  const { data: results = [] } = useQuery({
    queryKey: ["quiz-results-all"],
    queryFn: () => db.entities.QuizResult.list("-created_date", 100),
  });

  const { data: quizzes = [] } = useQuery({
    queryKey: ["quizzes-count"],
    queryFn: () => db.entities.Quiz.list(),
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["courses-count"],
    queryFn: () => db.entities.Course.list(),
  });

  const stats = useMemo(() => {
    const totalQuizzes = quizzes.length;
    const completedQuizIds = new Set(results.map((r) => r.quiz_id));
    const completedQuizzes = completedQuizIds.size;
    const quizProgress = totalQuizzes > 0 ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0;

    const avgScore = results.length > 0
      ? Math.round(results.reduce((a, r) => a + (r.score / (r.total_questions || 1)) * 100, 0) / results.length)
      : 0;
    const bestScore = results.length > 0
      ? Math.max(...results.map((r) => Math.round((r.score / (r.total_questions || 1)) * 100)))
      : 0;

    // Last 5 quiz results with quiz title
    const quizMap = Object.fromEntries(quizzes.map((q) => [q.id, q]));
    const recentResults = results.slice(0, 5).map((r) => ({
      ...r,
      quiz: quizMap[r.quiz_id] || null,
      pct: Math.round((r.score / (r.total_questions || 1)) * 100),
    }));

    // Course completion % based on favorites as proxy for "seen"
    const totalCourses = courses.length;
    const viewedCourses = favorites.length;
    const courseProgress = totalCourses > 0 ? Math.min(100, Math.round((viewedCourses / totalCourses) * 100)) : 0;

    // Subjects to revise: categories where avg score < 60%
    const categoryScores = {};
    results.forEach((r) => {
      const quiz = quizMap[r.quiz_id];
      if (!quiz) return;
      const cat = quiz.category;
      if (!categoryScores[cat]) categoryScores[cat] = { total: 0, count: 0 };
      categoryScores[cat].total += (r.score / (r.total_questions || 1)) * 100;
      categoryScores[cat].count += 1;
    });

    const weakSubjects = Object.entries(categoryScores)
      .map(([cat, s]) => ({ cat, avg: Math.round(s.total / s.count) }))
      .filter((s) => s.avg < 65)
      .sort((a, b) => a.avg - b.avg)
      .slice(0, 4);

    return { totalQuizzes, completedQuizzes, quizProgress, avgScore, bestScore, recentResults, totalCourses, courseProgress, viewedCourses, weakSubjects };
  }, [results, quizzes, courses, favorites]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="max-w-4xl mx-auto px-6 md:px-12 pb-10"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">Ma progression</h2>
        <Link to="/quiz" className="text-xs text-primary hover:underline font-medium">Voir tous les quiz →</Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatCard icon={HelpCircle} label="Quiz terminés" value={`${stats.completedQuizzes}/${stats.totalQuizzes}`} sub="quiz complétés" color="bg-primary" to="/quiz" />
        <StatCard icon={TrendingUp} label="Score moyen" value={`${stats.avgScore}%`} sub="sur tous les quiz" color="bg-emerald-500" />
        <StatCard icon={Award} label="Meilleur score" value={`${stats.bestScore}%`} sub="record personnel" color="bg-amber-500" />
        <StatCard icon={BookOpen} label="Cours disponibles" value={stats.totalCourses} sub="leçons au total" color="bg-purple-500" to="/cours" />
      </div>

      {/* Row 2: cours progress + quiz coverage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

        {/* Course progress */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Cours explorés</p>
              <p className="text-xs text-muted-foreground">{stats.viewedCourses} cours mis en favoris sur {stats.totalCourses}</p>
            </div>
            <div className="relative flex items-center justify-center">
              <RadialProgress value={stats.courseProgress} color="hsl(var(--chart-3))" />
              <span className="absolute text-sm font-bold text-foreground">{stats.courseProgress}%</span>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${stats.courseProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <Link to="/cours" className="mt-3 inline-block text-xs text-primary hover:underline">Continuer les cours →</Link>
        </div>

        {/* Quiz completion */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Couverture des quiz</p>
              <p className="text-xs text-muted-foreground">{stats.completedQuizzes} quiz sur {stats.totalQuizzes} tentés</p>
            </div>
            <div className="relative flex items-center justify-center">
              <RadialProgress value={stats.quizProgress} color="hsl(var(--primary))" />
              <span className="absolute text-sm font-bold text-foreground">{stats.quizProgress}%</span>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${stats.quizProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <Link to="/quiz" className="mt-3 inline-block text-xs text-primary hover:underline">Faire un quiz →</Link>
        </div>
      </div>

      {/* Row 3: Recent results + Weak subjects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Recent quiz results */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm font-semibold text-foreground">Derniers quiz effectués</p>
          </div>
          {stats.recentResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-20 gap-2">
              <Target className="w-8 h-8 text-muted-foreground" />
              <p className="text-xs text-muted-foreground text-center">Aucun quiz complété encore.<br />Commencez dès maintenant !</p>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {stats.recentResults.map((r, i) => {
                const good = r.pct >= 70;
                return (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className={`w-4 h-4 shrink-0 ${good ? "text-emerald-500" : "text-amber-500"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-muted-foreground truncate">
                          {r.quiz?.title || `Quiz #${i + 1}`}
                        </span>
                        <span className={`font-semibold shrink-0 ml-2 ${good ? "text-emerald-600" : "text-amber-600"}`}>{r.pct}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${good ? "bg-emerald-500" : "bg-amber-500"}`}
                          style={{ width: `${r.pct}%` }}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Weak subjects */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <p className="text-sm font-semibold text-foreground">Sujets à réviser</p>
          </div>
          {stats.weakSubjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-20 gap-2">
              <Award className="w-8 h-8 text-emerald-500" />
              <p className="text-xs text-muted-foreground text-center">
                {results.length === 0
                  ? "Faites des quiz pour voir vos points faibles."
                  : "Excellent ! Pas de point faible détecté. 🎉"}
              </p>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {stats.weakSubjects.map((s, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <span className="text-[9px] font-bold text-amber-600">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-foreground font-medium truncate">{categoryLabels[s.cat] || s.cat}</span>
                      <span className="text-amber-600 font-semibold shrink-0 ml-2">{s.avg}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-amber-400" style={{ width: `${s.avg}%` }} />
                    </div>
                  </div>
                  <Link to="/quiz" className="text-[10px] text-primary hover:underline shrink-0">Réviser</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </motion.section>
  );
}