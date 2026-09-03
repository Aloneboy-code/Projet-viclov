import { useState, useEffect, useRef } from "react";
import { Send, Loader2, Sparkles, WifiOff, Coins, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import MessageBubble from "@/components/ai/MessageBubble";
import { useLoading } from "../contexts/LoadingContext";
import { useCredits } from "../contexts/CreditsContext";

export default function AITutor() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { showLoading, hideLoading } = useLoading();
  const { credits, deductCredit, addCredits, hasCredits } = useCredits();

  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const callClaudeAPI = async (promptUtilisateur) => {
    const response = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: promptUtilisateur })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Erreur (${response.status}): ${data.error?.message || data.error}`);
    }

    if (data?.content?.[0]?.text) return data.content[0].text;
    throw new Error(`Structure inattendue: ${JSON.stringify(data)}`);
  };

  const sendMessage = async () => {
    if (!input.trim() || isGenerating) return;

    // Vérifier les crédits avant d'envoyer
    if (!hasCredits()) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ **Crédits insuffisants**\n\nVous n'avez plus de crédits pour poser des questions. Cliquez sur le bouton **+ Ajouter des crédits** pour continuer."
        }
      ]);
      return;
    }

    const text = input.trim();
    setInput("");
    setIsGenerating(true);

    setMessages(prev => [...prev, { role: "user", content: text }]);

    showLoading("Analyse clinique en cours, veuillez patienter...");

    try {
      const response = await callClaudeAPI(text);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      // Déduire un crédit après une réponse réussie
      deductCredit();
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ Erreur : ${error.message}`
        }
      ]);
    } finally {
      setIsGenerating(false);
      hideLoading();
    }
  };

  const suggestedQuestions = [
    "Explique-moi le mécanisme de l'infarctus du myocarde",
    "Quels sont les signes du syndrome de Cushing ?",
    "Comment fonctionne le système rénine-angiotensine ?",
    "Mnémotechnique pour les 12 nerfs crâniens",
  ];

  // Écran hors ligne
  if (!isOnline) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-6 px-6">
        <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center">
          <WifiOff className="w-10 h-10 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">
            Pas de connexion internet
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm">
            VicLov Assistant nécessite une connexion internet pour fonctionner.
            Reconnectez-vous pour accéder à l'assistant médical.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
          <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-amber-700 dark:text-amber-400 text-sm">
            Les cours, eux, sont disponibles hors ligne.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#005F73] to-[#0A9396] px-6 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center overflow-hidden">
            <img
              src="/viclov-logo.jpeg"
              alt="VicLov"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">
              VicLov Assistant
            </h1>
            <p className="text-white/70 text-xs">Assistant pédagogique médical</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {/* Solde de crédits */}
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1.5">
              <Coins className="w-4 h-4 text-yellow-300" />
              <span className="text-white text-sm font-semibold">{credits}</span>
              <span className="text-white/70 text-xs">crédits</span>
            </div>
            {/* Bouton ajouter crédits */}
            <Button
              onClick={() => addCredits(5)}
              variant="ghost"
              className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full text-xs font-medium"
              size="sm"
            >
              <Plus className="w-3 h-3 mr-1" />
              Ajouter
            </Button>
            {/* Statut connexion */}
            <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white text-xs font-medium">En ligne</span>
            </div>
          </div>
        </div>

        {/* Zone messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center px-6 pt-8"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#005F73] to-[#0A9396] flex items-center justify-center mb-5 shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Bonjour, je suis VicLov Assistant
              </h2>
              <p className="text-muted-foreground text-sm mb-8 max-w-sm">
                Posez-moi n'importe quelle question sur l'anatomie, la physiologie,
                la pharmacologie ou toute autre matière médicale.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(q)}
                    className="text-left px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground hover:bg-muted hover:border-[#0A9396]/30 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <MessageBubble message={msg} />
                </motion.div>
              ))}

              {/* Indicateur de génération */}
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#0A9396]/10 flex items-center justify-center overflow-hidden">
                    <img
                      src="/viclov-logo.jpeg"
                      alt="VicLov"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="bg-card border border-border rounded-2xl px-4 py-3 flex gap-1.5">
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-[#0A9396] animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Zone de saisie */}
        <div className="border-t border-border bg-card p-4">
          <div className="flex gap-3 max-w-3xl mx-auto">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Posez votre question médicale..."
              className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0A9396]/30"
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isGenerating}
              className="bg-[#005F73] hover:bg-[#005F73]/90 text-white px-4 rounded-xl"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}