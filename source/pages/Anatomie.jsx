import { useState } from "react";
import HumanBody3D from "@/components/anatomy/HumanBody3D";
import { Bone, Heart, Brain, Activity, Wind, Info, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SYSTEMS = [
  {
    key: "skeleton", label: "Squelette", icon: Bone,
    color: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "#f0e0c8",
    stats: ["208 os", "206 articulations", "Hydroxyapatite de calcium"],
    desc: "Le squelette est la charpente rigide du corps. Il protège les organes vitaux, produit les cellules sanguines dans la moelle osseuse et stocke le calcium. Les os sont composés à 70% de minéraux (principalement hydroxyapatite) et à 30% de protéines organiques (collagène).",
    facts: [
      "L'os le plus long : le fémur (~50 cm chez l'adulte)",
      "L'os le plus petit : l'étrier dans l'oreille (~3 mm)",
      "La moelle rouge produit ~200 milliards de globules rouges/jour"
    ]
  },
  {
    key: "muscles", label: "Muscles", icon: Activity,
    color: "bg-red-100 text-red-700 border-red-200",
    dot: "#cc3333",
    stats: ["650+ muscles", "40% masse corporelle", "3 types : squelettique, cardiaque, lisse"],
    desc: "Les muscles squelettiques sont composés de fibres striées contrôlées volontairement. La contraction est médiée par l'acétylcholine à la jonction neuromusculaire. Le mécanisme actine-myosine transforme l'énergie chimique (ATP) en force mécanique.",
    facts: [
      "Muscle le plus puissant (relatif) : le masséter (mâchoire)",
      "Muscle le plus long : le sartorius (cuisse)",
      "Le cœur bat ~100 000 fois par jour sans se fatiguer"
    ]
  },
  {
    key: "circulatory", label: "Circulatoire", icon: Heart,
    color: "bg-rose-100 text-rose-700 border-rose-200",
    dot: "#dd1111",
    stats: ["100 000 km de vaisseaux", "~5 L de sang", "70 battements/min"],
    desc: "Le système circulatoire distribue l'oxygène, les nutriments et les hormones à chaque cellule. Le cœur est une pompe à double circuit : la petite circulation (pulmonaire) oxygène le sang, la grande circulation (systémique) le distribue au corps.",
    facts: [
      "Le cœur pompe ~7 000 L de sang par jour",
      "Les capillaires : diamètre de 5–10 µm (plus fins qu'un cheveu)",
      "Les globules rouges vivent environ 120 jours"
    ]
  },
  {
    key: "nervous", label: "Nerveux", icon: Brain,
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    dot: "#ffe033",
    stats: ["86 milliards de neurones", "150 m/s vitesse signal", "100 000 milliards de synapses"],
    desc: "Le système nerveux central (cerveau + moelle épinière) traite l'information. Le SNP (nerfs périphériques) connecte le SNC aux organes et muscles. Les neurones communiquent via des potentiels d'action et des neurotransmetteurs (dopamine, sérotonine, GABA…).",
    facts: [
      "Le cerveau consomme 20% de l'énergie du corps",
      "Vitesse des influx nerveux : de 0.5 à 150 m/s",
      "Le cervelet coordonne l'équilibre et les mouvements fins"
    ]
  },
  {
    key: "organs", label: "Organes", icon: Wind,
    color: "bg-orange-100 text-orange-700 border-orange-200",
    dot: "#ee7755",
    stats: ["78 organes", "Foie : 500+ fonctions", "Poumons : 70 m² de surface"],
    desc: "Les organes vitaux assurent les grandes fonctions de l'organisme : respiration (poumons), digestion (estomac, intestin), filtration (reins, foie), immunité (rate), régulation hormonale (pancréas, surrénales). Chaque organe est irrigué par ses propres artères.",
    facts: [
      "Le foie se régénère entièrement en 6–8 semaines",
      "Les reins filtrent ~180 L de sang par jour",
      "L'intestin grêle mesure 6–7 m de long"
    ]
  }
];

const LEGEND = [
  { color: "#f0e0c8", label: "Squelette" },
  { color: "#cc3333", label: "Muscles" },
  { color: "#dd1111", label: "Artères" },
  { color: "#2244bb", label: "Veines" },
  { color: "#ffe033", label: "Nerfs" },
  { color: "#ee7755", label: "Organes" },
];

export default function Anatomy() {
  const [activeSystems, setActiveSystems] = useState(["skeleton"]);
  const [selectedSystem, setSelectedSystem] = useState(SYSTEMS[0]);
  const [showPanel, setShowPanel] = useState(false);

  const toggle = (key) => {
    setActiveSystems(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
    const s = SYSTEMS.find(s => s.key === key);
    setSelectedSystem(s);
    setShowPanel(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-700 to-fuchsia-600 px-6 pt-8 pb-5 md:px-12">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Anatomie 3D Interactive</h1>
        <p className="text-white/70 text-sm">Explorez les systèmes du corps humain — glissez pour tourner, double-clic pour auto-rotation</p>
      </div>

      {/* System toggles */}
      <div className="bg-card border-b border-border px-4 py-3 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {SYSTEMS.map(s => {
            const active = activeSystems.includes(s.key);
            return (
              <button
                key={s.key}
                onClick={() => toggle(s.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  active ? s.color + " shadow-sm scale-[1.03]" : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted"
                }`}
              >
                <s.icon className="w-4 h-4" />
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden" style={{ minHeight: "60vh" }}>
        {/* 3D Viewport */}
        <div className="flex-1 relative">
          <HumanBody3D activeSystems={activeSystems} />

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 p-3 text-xs space-y-1.5">
            <p className="font-semibold text-white/80 mb-2 text-[11px] uppercase tracking-wider">Légende</p>
            {LEGEND.map(l => (
              <div key={l.label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: l.color }} />
                <span className="text-white/70">{l.label}</span>
              </div>
            ))}
          </div>

          {/* Hint */}
          <motion.div
            initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 5, duration: 1.5 }}
            className="absolute top-4 right-4 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 px-4 py-3 text-sm pointer-events-none"
          >
            <p className="font-medium text-white">🖱 Glissez pour tourner</p>
            <p className="text-white/60 text-xs">Molette pour zoomer · Double-clic pour auto-rotation</p>
          </motion.div>

          {/* Info button */}
          <button
            onClick={() => setShowPanel(v => !v)}
            className="absolute top-4 left-4 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 p-2 text-white/70 hover:text-white transition-all"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>

        {/* Info side panel (desktop) */}
        <AnimatePresence>
          {showPanel && selectedSystem && (
            <motion.aside
              key="panel"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="hidden md:flex flex-col bg-card border-l border-border overflow-hidden"
            >
              <div className="p-5 overflow-y-auto flex-1">
                {/* System header */}
                <div className={`flex items-center gap-3 mb-4 p-3 rounded-xl border ${selectedSystem.color}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedSystem.color}`}>
                    <selectedSystem.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{selectedSystem.label}</h3>
                    <p className="text-xs text-muted-foreground">Système anatomique</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-2 mb-4">
                  {selectedSystem.stats.map((stat, i) => (
                    <div key={i} className="bg-muted/50 rounded-lg px-3 py-2 text-xs font-medium text-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: selectedSystem.dot }} />
                      {stat}
                    </div>
                  ))}
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{selectedSystem.desc}</p>

                {/* Facts */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Le saviez-vous ?</p>
                  {selectedSystem.facts.map((f, i) => (
                    <div key={i} className="flex gap-2 text-xs text-muted-foreground">
                      <span className="text-primary font-bold shrink-0">→</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile info cards */}
      <div className="md:hidden px-4 py-5 bg-background space-y-3">
        <AnimatePresence>
          {SYSTEMS.filter(s => activeSystems.includes(s.key)).map(s => (
            <motion.div key={s.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-card rounded-xl border border-border p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{s.label}</h3>
                  <p className="text-xs text-muted-foreground">{s.stats[0]}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.desc.slice(0, 160)}…</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}