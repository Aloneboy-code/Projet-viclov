import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Star, Send, MessageCircle, ThumbsUp, Award, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/mockData";

const CATEGORIES = {
  interface: { label: "Interface", color: "bg-blue-100 text-blue-700" },
  contenu: { label: "Contenu", color: "bg-emerald-100 text-emerald-700" },
  fonctionnalites: { label: "Fonctionnalités", color: "bg-purple-100 text-purple-700" },
  general: { label: "Général", color: "bg-amber-100 text-amber-700" },
};

function StarRating({ value, onChange, readonly = false }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} type="button"
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={readonly ? "cursor-default" : "cursor-pointer"}
        >
          <Star className={`w-6 h-6 transition-colors ${
            star <= (hovered || value)
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground"
          }`} />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  const initials = review.created_by?.split("@")[0]?.slice(0, 2)?.toUpperCase() || "??";
  const date = new Date(review.created_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center text-white text-sm font-bold">
            {initials}
          </div>
          <div>
            <p className="font-medium text-foreground text-sm">{review.created_by?.split("@")[0]}</p>
            <p className="text-xs text-muted-foreground">{date}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StarRating value={review.rating} readonly />
          {review.category && (
            <Badge className={`${CATEGORIES[review.category]?.color} text-xs border-0`}>
              {CATEGORIES[review.category]?.label}
            </Badge>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
    </motion.div>
  );
}

export default function Reviews() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState("general");
  const [submitted, setSubmitted] = useState(false);
  const qc = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: () => db.entities.Review.list("-created_date", 50),
  });

  const { mutate: submitReview, isPending } = useMutation({
    mutationFn: async (data) => {
      const review = await db.entities.Review.create(data);
      // Email sending disabled - replace with your own email service
      // await db.integrations.Core.SendEmail({
      //   to: "amadouvictoire97@gmail.com",
      //   subject: `Nouvel avis VicLov — ${data.rating}/5 étoiles`,
      //   body: `Un nouvel avis a été soumis sur VicLov.\n\nNote : ${data.rating}/5\nCatégorie : ${CATEGORIES[data.category]?.label || data.category}\nCommentaire : ${data.comment}\n\nUtilisateur : ${review.created_by || "Anonyme"}`,
      // });
      return review;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
      setRating(0);
      setComment("");
      setCategory("general");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    },
  });

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) return;
    submitReview({ rating, comment, category });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 pt-8 pb-12 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="w-7 h-7 text-white" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">Avis des apprenants</h1>
          </div>
          <p className="text-white/70">Votre retour nous aide à améliorer VicLov</p>
          {avgRating && (
            <div className="mt-4 flex items-center gap-3 bg-white/15 backdrop-blur rounded-xl px-4 py-3 w-fit">
              <span className="text-3xl font-bold text-white">{avgRating}</span>
              <div>
                <StarRating value={Math.round(avgRating)} readonly />
                <p className="text-white/70 text-xs mt-0.5">{reviews.length} avis</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 -mt-6 pb-16 space-y-6">

        {/* Form */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
          <h2 className="font-bold text-foreground text-lg mb-5 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" /> Laisser mon avis
          </h2>

          <AnimatePresence>
            {submitted && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-emerald-700 text-sm font-medium flex items-center gap-2"
              >
                <ThumbsUp className="w-4 h-4" /> Merci pour votre avis !
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Note globale</label>
              <StarRating value={rating} onChange={setRating} />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Catégorie</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(CATEGORIES).map(([key, val]) => (
                  <button key={key} type="button"
                    onClick={() => setCategory(key)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                      category === key
                        ? val.color + " border-transparent shadow-sm"
                        : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
                    }`}
                  >
                    {val.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Votre commentaire</label>
              <Textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Dites-nous ce que vous pensez de VicLov..."
                className="min-h-[100px] resize-none"
              />
            </div>

            <Button type="submit" disabled={!rating || !comment.trim() || isPending}
              className="bg-primary text-white gap-2"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Envoyer mon avis
            </Button>
          </form>
        </div>

        {/* Reviews list */}
        <div>
          <h2 className="font-bold text-foreground text-lg mb-4">Tous les avis ({reviews.length})</h2>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Soyez le premier à laisser un avis !</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}