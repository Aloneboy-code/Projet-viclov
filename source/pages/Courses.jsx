import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Clock, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { useFavorites } from "@/hooks/useFavorites";
import FavoriteButton from "@/components/courses/FavoriteButton";
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

const difficultyLabels = { debutant: "Débutant", intermediaire: "Intermédiaire", avance: "Avancé" };

export default function Courses() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toggle, isFavorite } = useFavorites();

  const CACHE_KEY = "viclov_courses_cache";

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      try {
        const list = await db.entities.Course.list("order", 100);
        localStorage.setItem(CACHE_KEY, JSON.stringify(list));
        return list;
      } catch {
        const cached = localStorage.getItem(CACHE_KEY);
        return cached ? JSON.parse(cached) : [];
      }
    },
  });

  const categories = ["all", ...Object.keys(categoryLabels)];
  
  const filtered = courses.filter(c => {
    const matchSearch = c.title?.toLowerCase().includes(search.toLowerCase()) || 
                        c.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === "all" || c.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 pt-10 pb-14 md:px-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">📚 Cours Médicaux</h1>
          <p className="text-white/70 mb-6">Explorez tous les domaines de la médecine</p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <Input
              placeholder="Rechercher un cours..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-white/15 border-white/20 text-white placeholder:text-white/50 pl-10 h-12 rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 -mt-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-card text-muted-foreground border border-border hover:bg-muted"
                }`}
              >
                {cat === "all" ? "Tous" : categoryLabels[cat]}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-card rounded-2xl p-6 animate-pulse h-40 border border-border" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((course, idx) => (
                <motion.div key={course.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                  <div className="relative bg-card rounded-2xl p-6 border border-border hover:shadow-lg hover:-translate-y-0.5 transition-all">
                    <div className="absolute top-4 right-4">
                      <FavoriteButton courseId={course.id} isFav={isFavorite(course.id)} onToggle={toggle} />
                    </div>
                    <Link to={`/cours/${course.id}`} className="block">
                      <div className="flex items-start justify-between mb-3 pr-10">
                        <Badge className={categoryColors[course.category] || "bg-gray-100 text-gray-700"}>
                          {categoryLabels[course.category] || course.category}
                        </Badge>
                        {course.difficulty && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <BarChart3 className="w-3 h-3" />
                            {difficultyLabels[course.difficulty]}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground text-lg mb-2">{course.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">{course.description}</p>
                      {course.video_url && (
                        <div className="mt-3 flex items-center gap-1 text-primary text-sm">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Vidéo disponible</span>
                        </div>
                      )}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun cours trouvé</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}