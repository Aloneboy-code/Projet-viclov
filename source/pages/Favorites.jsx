import { useQuery } from "@tanstack/react-query";

import { Link } from "react-router-dom";
import { Heart, BookOpen, BarChart3, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useFavorites } from "@/hooks/useFavorites";
import FavoriteButton from "@/components/courses/FavoriteButton";

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

export default function Favorites() {
  const { favorites, toggle, isFavorite } = useFavorites();

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: () => db.entities.Course.list("order", 100),
  });

  const favoriteCourses = courses.filter(c => isFavorite(c.id));

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-rose-500 to-pink-400 px-6 pt-10 pb-14 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-7 h-7 text-white fill-white" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">Mes Favoris</h1>
          </div>
          <p className="text-white/70">
            {favoriteCourses.length} cours sauvegardé{favoriteCourses.length !== 1 ? "s" : ""} pour la révision
          </p>
        </div>
      </div>

      <div className="px-6 md:px-12 -mt-6 pb-12">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <div key={i} className="bg-card rounded-2xl p-6 animate-pulse h-40 border border-border" />
              ))}
            </div>
          ) : favoriteCourses.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-14 h-14 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-foreground font-medium text-lg mb-1">Aucun favori pour l'instant</p>
              <p className="text-muted-foreground text-sm mb-6">
                Cliquez sur le ♡ sur une fiche de cours pour l'ajouter ici.
              </p>
              <Link to="/cours" className="text-primary hover:underline text-sm font-medium">
                → Parcourir les cours
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favoriteCourses.map((course, idx) => (
                <motion.div key={course.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                  <div className="relative bg-card rounded-2xl p-6 border border-border hover:shadow-lg hover:-translate-y-0.5 transition-all">
                    <div className="absolute top-4 right-4">
                      <FavoriteButton courseId={course.id} onToggle={toggle} isFav={isFavorite(course.id)} />
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
        </div>
      </div>
    </div>
  );
}