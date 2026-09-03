import { Heart } from "lucide-react";

export default function FavoriteButton({ courseId, isFav, onToggle }) {
  return (
    <button
      onClick={e => { e.preventDefault(); e.stopPropagation(); onToggle(courseId); }}
      className={`p-2 rounded-xl transition-all ${
        isFav
          ? "text-rose-500 bg-rose-50 hover:bg-rose-100"
          : "text-muted-foreground bg-muted hover:text-rose-400 hover:bg-rose-50"
      }`}
      title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Heart className={`w-4 h-4 ${isFav ? "fill-rose-500" : ""}`} />
    </button>
  );
}