import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, BarChart3, List, ChevronRight, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { db } from "@/lib/mockData";

const categoryLabels = {
  anatomie: "Anatomie", physiologie: "Physiologie", biochimie: "Biochimie",
  microbiologie: "Microbiologie", pathologie: "Pathologie", pharmacologie: "Pharmacologie",
  histologie: "Histologie", embryologie: "Embryologie", neurologie: "Neurologie", cardiologie: "Cardiologie"
};

const categoryColors = {
  anatomie: "bg-blue-100 text-blue-700", physiologie: "bg-emerald-100 text-emerald-700",
  biochimie: "bg-purple-100 text-purple-700", microbiologie: "bg-amber-100 text-amber-700",
  pathologie: "bg-rose-100 text-rose-700", pharmacologie: "bg-teal-100 text-teal-700",
  histologie: "bg-indigo-100 text-indigo-700", embryologie: "bg-pink-100 text-pink-700",
  neurologie: "bg-cyan-100 text-cyan-700", cardiologie: "bg-red-100 text-red-700"
};

const difficultyColors = {
  debutant: "bg-green-100 text-green-700",
  intermediaire: "bg-amber-100 text-amber-700",
  avance: "bg-red-100 text-red-700"
};

const difficultyLabels = { debutant: "Débutant", intermediaire: "Intermédiaire", avance: "Avancé" };

// Extract headings from markdown content for TOC
function extractHeadings(content = "") {
  const lines = content.split("\n");
  return lines
    .filter(l => l.startsWith("## ") || l.startsWith("### "))
    .map(l => ({
      level: l.startsWith("### ") ? 3 : 2,
      text: l.replace(/^#{2,3} /, ""),
      id: l.replace(/^#{2,3} /, "").toLowerCase().replace(/[^a-z0-9]+/g, "-")
    }));
}

// Custom components for ReactMarkdown
const mdComponents = {
  h1: ({ children }) => (
    <h1 className="text-2xl md:text-3xl font-bold text-foreground mt-8 mb-4 pb-2 border-b border-border first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => {
    const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return (
      <h2 id={id} className="text-xl font-bold text-foreground mt-8 mb-3 flex items-center gap-2">
        <span className="w-1 h-5 bg-primary rounded-full inline-block shrink-0" />
        {children}
      </h2>
    );
  },
  h3: ({ children }) => {
    const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return (
      <h3 id={id} className="text-base font-semibold text-foreground mt-6 mb-2">
        {children}
      </h3>
    );
  },
  p: ({ children }) => (
    <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="space-y-1.5 mb-4 ml-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="space-y-1.5 mb-4 ml-4 list-decimal">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="flex items-start gap-2 text-muted-foreground">
      <span className="text-primary font-bold mt-0.5 shrink-0">·</span>
      <span>{children}</span>
    </li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-muted-foreground">{children}</em>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary pl-4 my-4 bg-primary/5 py-3 rounded-r-lg">
      {children}
    </blockquote>
  ),
  code: ({ inline, children }) =>
    inline ? (
      <code className="bg-muted text-foreground px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
    ) : (
      <pre className="bg-muted rounded-xl p-4 overflow-x-auto mb-4">
        <code className="text-sm font-mono text-foreground">{children}</code>
      </pre>
    ),
  hr: () => <hr className="border-border my-6" />,
};

export default function CourseDetail() {
  const { id } = useParams();
  const [tocOpen, setTocOpen] = useState(false);
  const contentRef = useRef(null);

  const CACHE_KEY = "viclov_courses_cache";

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      try {
        const list = await db.entities.Course.list();
        localStorage.setItem(CACHE_KEY, JSON.stringify(list));
        return list;
      } catch {
        const cached = localStorage.getItem(CACHE_KEY);
        return cached ? JSON.parse(cached) : [];
      }
    },
  });

  const course = courses.find(c => c.id === id);
  const headings = course ? extractHeadings(course.content) : [];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setTocOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <BookOpen className="w-16 h-16 text-muted-foreground" />
        <p className="text-muted-foreground text-lg">Cours non trouvé</p>
        <Link to="/cours" className="text-primary hover:underline">← Retour aux cours</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 pt-8 pb-12 md:px-12">
        <div className="max-w-5xl mx-auto">
          <Link to="/cours" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-5 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Retour aux cours
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge className={`${categoryColors[course.category] || "bg-white/20 text-white"} border-0`}>
              {categoryLabels[course.category] || course.category}
            </Badge>
            {course.difficulty && (
              <Badge className={`${difficultyColors[course.difficulty]} border-0`}>
                <BarChart3 className="w-3 h-3 mr-1" />
                {difficultyLabels[course.difficulty]}
              </Badge>
            )}
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 leading-tight">{course.title}</h1>
          <p className="text-white/80 text-base md:text-lg max-w-3xl">{course.description}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 -mt-6 pb-16">
        <div className="flex gap-8 items-start">

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* Video */}
            {course.video_url && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl border border-border overflow-hidden shadow-lg mb-6">
                <div className="aspect-video bg-black flex items-center justify-center">
                  <iframe src={course.video_url} className="w-full h-full" allowFullScreen title={course.title} />
                </div>
                <div className="px-5 py-3 flex items-center gap-2 text-sm text-muted-foreground border-t border-border">
                  <Play className="w-4 h-4 text-primary" />
                  Vidéo du cours
                </div>
              </motion.div>
            )}

            {/* Mobile TOC toggle */}
            {headings.length > 0 && (
              <button
                onClick={() => setTocOpen(v => !v)}
                className="md:hidden w-full flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3 mb-4 text-sm font-medium text-foreground"
              >
                <span className="flex items-center gap-2"><List className="w-4 h-4 text-primary" /> Table des matières</span>
                <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${tocOpen ? "rotate-90" : ""}`} />
              </button>
            )}
            {tocOpen && headings.length > 0 && (
              <div className="md:hidden bg-card border border-border rounded-xl px-4 py-3 mb-4 space-y-1">
                {headings.map((h, i) => (
                  <button key={i} onClick={() => scrollTo(h.id)}
                    className={`block w-full text-left text-sm py-1 hover:text-primary transition-colors ${h.level === 3 ? "pl-4 text-muted-foreground" : "font-medium text-foreground"}`}>
                    {h.level === 2 ? `${i + 1}. ` : "→ "}{h.text}
                  </button>
                ))}
              </div>
            )}

            {/* Course content */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              ref={contentRef}
              className="bg-card rounded-2xl border border-border p-6 md:p-10 shadow-sm"
            >
              {course.content ? (
                <ReactMarkdown components={mdComponents}>{course.content}</ReactMarkdown>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Contenu en cours de rédaction…</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Desktop sidebar TOC */}
          {headings.length > 0 && (
            <aside className="hidden md:block w-60 shrink-0 sticky top-6">
              <div className="bg-card rounded-2xl border border-border p-4">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <List className="w-4 h-4 text-primary" /> Sommaire
                </p>
                <nav className="space-y-0.5">
                  {headings.map((h, i) => (
                    <button key={i} onClick={() => scrollTo(h.id)}
                      className={`block w-full text-left py-1.5 px-2 rounded-lg text-sm hover:bg-muted transition-colors ${
                        h.level === 2 ? "font-medium text-foreground" : "pl-4 text-muted-foreground text-xs"
                      }`}>
                      {h.text}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}