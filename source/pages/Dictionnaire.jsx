import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookMarked, X, Stethoscope, Microscope, FlaskConical, Scissors } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/mockData";

const categoryLabels = {
  anatomie: "Anatomie", physiologie: "Physiologie", pathologie: "Pathologie",
  pharmacologie: "Pharmacologie", microbiologie: "Microbiologie", biochimie: "Biochimie",
  chirurgie: "Chirurgie", radiologie: "Radiologie", genetique: "Génétique",
  immunologie: "Immunologie", neurologie: "Neurologie", cardiologie: "Cardiologie",
  pneumologie: "Pneumologie", gastro_enterologie: "Gastro-entérologie", nephrologie: "Néphrologie",
  hematologie: "Hématologie", dermatologie: "Dermatologie", ophtalmologie: "Ophtalmologie",
  orl: "ORL", gynecologie: "Gynécologie", pediatrie: "Pédiatrie", psychiatrie: "Psychiatrie", general: "Général"
};

export default function Dictionary() {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [letterFilter, setLetterFilter] = useState("");

  const { data: terms = [], isLoading } = useQuery({
    queryKey: ["medical-terms"],
    queryFn: () => db.entities.MedicalTerm.list("term", 20000),
  });

  const letters = [...new Set(terms.map(t => t.term?.[0]?.toUpperCase()).filter(Boolean))].sort();
  const categories = ["all", ...new Set(terms.map(t => t.category).filter(Boolean))];

  const filtered = terms.filter(t => {
    const matchSearch = t.term?.toLowerCase().includes(search.toLowerCase()) ||
                        t.definition?.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat === "all" || t.category === selectedCat;
    const matchLetter = !letterFilter || t.term?.[0]?.toUpperCase() === letterFilter;
    return matchSearch && matchCat && matchLetter;
  });

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-orange-500 to-amber-400 px-6 pt-10 pb-14 md:px-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">📖 Dictionnaire Médical</h1>
          <p className="text-white/80 mb-6">{terms.length} termes médicaux</p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <Input
              placeholder="Rechercher un terme..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-white/15 border-white/20 text-white placeholder:text-white/50 pl-10 h-12 rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 -mt-6 pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Alphabet bar */}
          <div className="flex gap-1 overflow-x-auto pb-3 mb-3 scrollbar-hide">
            <button
              onClick={() => setLetterFilter("")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !letterFilter ? "bg-orange-500 text-white" : "bg-card text-muted-foreground border border-border"
              }`}
            >
              Tous
            </button>
            {letters.map(l => (
              <button
                key={l}
                onClick={() => setLetterFilter(l === letterFilter ? "" : l)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  letterFilter === l ? "bg-orange-500 text-white" : "bg-card text-muted-foreground border border-border hover:bg-muted"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
            {categories.slice(0, 12).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCat === cat
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-card text-muted-foreground border border-border hover:bg-muted"
                }`}
              >
                {cat === "all" ? "Toutes" : categoryLabels[cat] || cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[1,2,3,4,5,6].map(i => <div key={i} className="bg-card rounded-xl h-16 animate-pulse border border-border" />)}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(term => (
                <button
                  key={term.id}
                  onClick={() => setSelectedTerm(term)}
                  className="w-full text-left bg-card rounded-xl p-4 border border-border hover:shadow-md hover:border-orange-200 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{term.term}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{term.definition}</p>
                    </div>
                    {term.category && (
                      <Badge variant="secondary" className="text-xs ml-3 shrink-0">
                        {categoryLabels[term.category] || term.category}
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-20">
              <BookMarked className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun terme trouvé</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedTerm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center"
            onClick={() => setSelectedTerm(null)}
          >
            <motion.div
              initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
              onClick={e => e.stopPropagation()}
              className="bg-card rounded-t-3xl md:rounded-3xl w-full md:max-w-lg max-h-[85vh] overflow-y-auto p-6 border border-border shadow-2xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{selectedTerm.term}</h2>
                  {selectedTerm.etymology && (
                    <p className="text-xs text-muted-foreground italic mt-1">Étymologie : {selectedTerm.etymology}</p>
                  )}
                </div>
                <button onClick={() => setSelectedTerm(null)} className="p-1 rounded-full hover:bg-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <DetailBlock title="Définition" text={selectedTerm.definition} />
                {selectedTerm.organ && <DetailBlock title="Organe concerné" text={selectedTerm.organ} />}
                {selectedTerm.specialty && <DetailBlock title="Spécialité" text={selectedTerm.specialty} />}
                {selectedTerm.typical_pathologies && <DetailBlock title="Pathologies typiques" text={selectedTerm.typical_pathologies} />}
                {selectedTerm.associated_exams && <DetailBlock title="Examens associés" text={selectedTerm.associated_exams} />}
                {selectedTerm.treatments && <DetailBlock title="Traitements" text={selectedTerm.treatments} />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailBlock({ title, text }) {
  return (
    <div className="bg-muted/50 rounded-xl p-4">
      <h3 className="font-semibold text-sm text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}