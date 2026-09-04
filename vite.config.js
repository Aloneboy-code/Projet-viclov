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
            return res.end(JSON.stringify({ error: "Method Not Allowed" }));
          }

          let body = "";
          req.on("data", chunk => body += chunk);
          req.on("end", async () => {
            try {
              const { prompt } = JSON.parse(body);
              const apiKey = process.env.VITE_CLAUDE_API_KEY || process.env.CLAUDE_API_KEY;
              
              if (!apiKey) {
                console.error("❌ Clé API Claude non trouvée");
                res.statusCode = 500;
                return res.end(JSON.stringify({ error: { message: "Clé API Claude non configurée côté serveur" } }));
              }

              // Mode simulation pour développement sans crédits API
              const useSimulation = process.env.VITE_AI_SIMULATION === "true" || !apiKey;
              
              if (useSimulation) {
                console.log("🤖 Mode simulation activé");
                const simulatedResponse = {
                  content: [{
                    text: `# Réponse simulée\n\nCeci est une réponse de démonstration. Pour activer l'IA réelle, configurez votre clé API Claude.`
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
                  model: "claude-3-5-sonnet-20241022",
                  max_tokens: 1024,
                  system: "Tu es VicLov AI, assistant médical expert pour l'application VicLov. Tu es un médecin spécialisé qui explique les concepts médicaux de manière simple et claire.",
                  messages: [{ role: "user", content: prompt }]
                })
              });

              const data = await response.json();
              res.setHeader("Content-Type", "application/json");
              res.statusCode = response.status;
              res.end(JSON.stringify(data));
            } catch (err) {
              console.error("❌ Erreur API Claude:", err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: { message: err.message } }));
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
