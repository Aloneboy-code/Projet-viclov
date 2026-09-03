import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Pill, ChevronRight, X, AlertTriangle, Zap, ShieldAlert, Beaker } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/mockData";

const categoryLabels = {
  analgesique: "Analgésique", antibiotique: "Antibiotique", antiviral: "Antiviral",
  antifongique: "Antifongique", anti_inflammatoire: "Anti-inflammatoire", cardiovasculaire: "Cardiovasculaire",
  neurologique: "Neurologique", endocrinien: "Endocrinien", gastro_intestinal: "Gastro-intestinal",
  respiratoire: "Respiratoire", dermatologique: "Dermatologique", oncologique: "Oncologique",
  immunologique: "Immunologique", hematologique: "Hématologique", psychiatrique: "Psychiatrique",
  urologique: "Urologique", ophtalmologique: "Ophtalmologique", autre: "Autre"
};

export default function Pharmacology() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMed, setSelectedMed] = useState(null);

  const { data: medications = [], isLoading } = useQuery({
    queryKey: ["medications"],
    queryFn: () => db.entities.Medication.list("name", 35000),
  });

  const categories = ["all", ...new Set(medications.map(m => m.category).filter(Boolean))];

  const filtered = medications.filter(m => {
    const matchSearch = m.name?.toLowerCase().includes(search.toLowerCase()) ||
                        m.class?.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === "all" || m.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-6 pt-10 pb-14 md:px-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">💊 Pharmacologie</h1>
          <p className="text-white/70 mb-6">{medications.length} médicaments référencés</p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <Input
              placeholder="Rechercher un médicament..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-white/15 border-white/20 text-white placeholder:text-white/50 pl-10 h-12 rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 -mt-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "bg-card text-muted-foreground border border-border hover:bg-muted"
                }`}
              >
                {cat === "all" ? "Tous" : categoryLabels[cat] || cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1,2,3,4,5].map(i => <div key={i} className="bg-card rounded-xl h-20 animate-pulse border border-border" />)}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(med => (
                <motion.button
                  key={med.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  onClick={() => setSelectedMed(med)}
                  className="w-full text-left bg-card rounded-xl p-4 border border-border hover:shadow-md hover:border-emerald-200 transition-all flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-foreground">{med.name}</h3>
                    <p className="text-sm text-muted-foreground">{med.class}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{categoryLabels[med.category] || med.category}</Badge>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-20">
              <Pill className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun médicament trouvé</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedMed && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center"
            onClick={() => setSelectedMed(null)}
          >
            <motion.div
              initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
              onClick={e => e.stopPropagation()}
              className="bg-card rounded-t-3xl md:rounded-3xl w-full md:max-w-lg max-h-[85vh] overflow-y-auto p-6 border border-border shadow-2xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{selectedMed.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedMed.class}</p>
                </div>
                <button onClick={() => setSelectedMed(null)} className="p-1 rounded-full hover:bg-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {selectedMed.mechanism && (
                  <InfoBlock icon={Beaker} title="Mécanisme d'action" text={selectedMed.mechanism} color="text-blue-600" />
                )}
                {selectedMed.indications && (
                  <InfoBlock icon={Zap} title="Indications" text={selectedMed.indications} color="text-emerald-600" />
                )}
                {selectedMed.immediate_effects && (
                  <InfoBlock icon={Zap} title="Effets immédiats" text={selectedMed.immediate_effects} color="text-amber-600" />
                )}
                {selectedMed.side_effects && (
                  <InfoBlock icon={AlertTriangle} title="Effets secondaires" text={selectedMed.side_effects} color="text-red-600" />
                )}
                {selectedMed.contraindications && (
                  <InfoBlock icon={ShieldAlert} title="Contre-indications" text={selectedMed.contraindications} color="text-rose-600" />
                )}
                {selectedMed.dosage && (
                  <InfoBlock icon={Pill} title="Posologie" text={selectedMed.dosage} color="text-purple-600" />
                )}
                {selectedMed.interactions && (
                  <InfoBlock icon={AlertTriangle} title="Interactions" text={selectedMed.interactions} color="text-orange-600" />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoBlock({ icon: Icon, title, text, color }) {
  return (
    <div className="bg-muted/50 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <h3 className="font-semibold text-sm text-foreground">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}