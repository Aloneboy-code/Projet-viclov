import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  plugins: [
    react(),
    {
      name: "claude-proxy",
      configureServer(server) {
        server.middlewares.use("/api/claude", async (req, res) => {
          if (req.method !== "POST") {
            res.statusCode = 405;
            return res.end("Method Not Allowed");
          }

          let body = "";
          req.on("data", chunk => body += chunk);
          req.on("end", async () => {
            try {
              const { prompt } = JSON.parse(body);
              const apiKey = process.env.VITE_CLAUDE_API_KEY || process.env.CLAUDE_API_KEY;
              
              if (!apiKey) {
                console.error("❌ Clé API Claude non trouvée dans les variables d'environnement");
                res.statusCode = 500;
                return res.end(JSON.stringify({ error: "Clé API Claude non configurée côté serveur" }));
              }

              // Mode simulation pour développement sans crédits API
              const useSimulation = process.env.VITE_AI_SIMULATION === "true" || !apiKey;
              
              if (useSimulation) {
                console.log("🤖 Mode simulation activé (pas d'appel API réel)");
                const simulatedResponse = {
                  content: [{
                    text: `# Réponse simulée\n\nCeci est une réponse de démonstration du mode simulation. Pour activer l'IA réelle, vous devez :\n\n1. Avoir des crédits sur votre compte Anthropic\n2. Configurer une clé API valide dans le fichier .env\n\n**Question posée :** ${prompt}\n\nEn mode réel, VicLov AI répondrait avec des informations médicales détaillées et pédagogiques.`
                  }]
                };
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 200;
                return res.end(JSON.stringify(simulatedResponse));
              }

              const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-api-key": apiKey,
                  "anthropic-version": "2023-06-01"
                },
                body: JSON.stringify({
                  model: "claude-haiku-4-5-20251001",
                  max_tokens: 1024,
                  system: "Tu es VicLov AI, assistant médical expert pour l'application VicLov. Tu es un médecin spécialisé qui explique les concepts médicaux de manière simple et claire, comme si tu parlais à un élève de primaire (6-11 ans). Réponds toujours en français avec du Markdown structuré : titres, listes à puces, termes médicaux en gras. Utilise des analogies simples, des exemples concrets du quotidien, et évite le jargon technique complexe. Quand tu utilises un terme médical, explique-le simplement. Sois encourageant, positif et adapté aux enfants. Structure tes réponses avec des titres clairs et des exemples faciles à comprendre.",
                  messages: [{ role: "user", content: prompt }]
                })
              });

              const data = await response.json();
              res.setHeader("Content-Type", "application/json");
              res.statusCode = response.status;
              res.end(JSON.stringify(data));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        });
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./source")
    }
  }
})