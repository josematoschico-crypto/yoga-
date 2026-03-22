import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database("yoga.db");

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    email TEXT PRIMARY KEY,
    name TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.post("/api/register", (req, res) => {
    const { email, name } = req.body;
    if (!email || !name) {
      return res.status(400).json({ success: false, message: "Email and name are required." });
    }
    try {
      const stmt = db.prepare("INSERT INTO users (email, name) VALUES (?, ?)");
      stmt.run(email, name);
      
      // --- HIDDEN ADMIN NOTIFICATION ---
      const appUrl = process.env.APP_URL || "http://localhost:3000";
      const activationLink = `${appUrl}/api/admin/activate/${encodeURIComponent(email)}`;
      
      // Using Web3Forms for automated, hidden notification
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "3c4c25c8-18e1-4940-abf1-6307294127cc",
          subject: `NOVA SOLICITAÇÃO DE ACESSO - ${name}`,
          from_name: "Yoga Lotus System",
          to_email: "josematos.chico@gmail.com",
          message: `
Olá Administrador,

Um novo usuário solicitou acesso ao Yoga Lotus.

DADOS DO USUÁRIO:
-----------------
Nome: ${name}
E-mail: ${email}
Data: ${new Date().toLocaleString('pt-BR')}

AÇÃO NECESSÁRIA:
----------------
Para liberar o acesso deste aluno imediatamente, clique no link abaixo:

${activationLink}

Após clicar, o usuário será desbloqueado no banco de dados e poderá acessar todos os módulos premium.
          `
        })
      }).catch(err => console.error("Failed to send hidden notification:", err));

      console.log(`\n--- [HIDDEN] ADMIN NOTIFICATION LOGGED ---`);
      console.log(`User: ${name} (${email})`);
      console.log(`Activation Link: ${activationLink}`);
      console.log(`------------------------------------------\n`);
      
      res.json({ success: true, message: "Cadastro realizado! Aguarde a ativação pelo administrador." });
    } catch (e: any) {
      if (e.code === 'SQLITE_CONSTRAINT') {
        res.status(400).json({ success: false, message: "Este e-mail já está cadastrado." });
      } else {
        console.error(e);
        res.status(500).json({ success: false, message: "Erro no servidor ao processar cadastro." });
      }
    }
  });

  app.get("/api/status/:email", (req, res) => {
    const { email } = req.params;
    try {
      const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
      if (user) {
        res.json({ status: user.status });
      } else {
        res.json({ status: 'not_found' });
      }
    } catch (e) {
      res.status(500).json({ status: 'error' });
    }
  });

  app.get("/api/admin/users", (req, res) => {
    try {
      const users = db.prepare("SELECT * FROM users ORDER BY created_at DESC").all();
      res.json(users);
    } catch (e) {
      res.status(500).json({ success: false });
    }
  });

  app.post("/api/admin/activate", (req, res) => {
    const { email } = req.body;
    try {
      db.prepare("UPDATE users SET status = 'active' WHERE email = ?").run(email);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ success: false });
    }
  });

  app.get("/api/admin/activate/:email", (req, res) => {
    const { email } = req.params;
    try {
      const stmt = db.prepare("UPDATE users SET status = 'active' WHERE email = ?");
      const result = stmt.run(email);
      if (result.changes > 0) {
        res.send(`
          <html>
            <head>
              <meta charset="UTF-8">
              <title>Acesso Ativado</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f0fdfa; }
                .card { background: white; padding: 40px; border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.1); text-align: center; max-width: 400px; width: 90%; }
                h1 { color: #2ec4b6; margin-bottom: 16px; font-size: 28px; }
                p { color: #64748b; line-height: 1.6; margin-bottom: 24px; }
                .btn { background: #2ec4b6; color: white; border: none; padding: 14px 28px; border-radius: 12px; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-block; transition: transform 0.2s; }
                .btn:hover { transform: scale(1.05); }
              </style>
            </head>
            <body>
              <div class="card">
                <h1>Acesso Ativado! ✅</h1>
                <p>O usuário <strong>${email}</strong> agora tem acesso total aos módulos de yoga.</p>
                <p>O aluno já pode entrar no app e começar a praticar.</p>
                <button onclick="window.close()" class="btn">Fechar Janela</button>
              </div>
            </body>
          </html>
        `);
      } else {
        res.status(404).send("Usuário não encontrado.");
      }
    } catch (e) {
      res.status(500).send("Erro ao ativar usuário.");
    }
  });

  app.post("/api/admin/import", (req, res) => {
    const { users } = req.body;
    if (!Array.isArray(users)) return res.status(400).json({ success: false });
    try {
      db.prepare("DELETE FROM users").run();
      const insert = db.prepare("INSERT INTO users (email, name, status, created_at) VALUES (?, ?, ?, ?)");
      const transaction = db.transaction((users) => {
        for (const user of users) {
          insert.run(user.email, user.name, user.status || 'pending', user.created_at || new Date().toISOString());
        }
      });
      transaction(users);
      res.json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false });
    }
  });

  app.post("/api/admin/reset", (req, res) => {
    try {
      db.prepare("DELETE FROM users").run();
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ success: false });
    }
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
