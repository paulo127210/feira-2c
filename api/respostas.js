import { timingSafeEqual } from "node:crypto";
import { sql, ensureTable } from "../lib/db.js";

// Painel do professor: lista as respostas. Protegido pelo PIN definido
// na variável de ambiente PAINEL_PIN (configurada na Vercel).
function pinOk(recebido) {
  const certo = process.env.PAINEL_PIN || "";
  if (!certo || typeof recebido !== "string") return false;
  const a = Buffer.from(recebido), b = Buffer.from(certo);
  return a.length === b.length && timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ erro: "Método não permitido" });
  }
  if (!process.env.PAINEL_PIN) {
    return res.status(503).json({ erro: "PIN do painel ainda não configurado na Vercel (PAINEL_PIN)." });
  }
  if (!pinOk(req.headers["x-pin"])) {
    await new Promise(r => setTimeout(r, 600)); // freia tentativas de adivinhar o PIN
    return res.status(401).json({ erro: "PIN incorreto" });
  }
  try {
    await ensureTable();
    const rows = await sql`select created_at, dia, semana, dados from respostas order by created_at asc`;
    const out = rows.map(r => ({
      createdAt: new Date(r.created_at).toISOString(),
      dia: r.dia, semana: r.semana, ...(r.dados || {})
    }));
    return res.status(200).json(out);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ erro: "Não foi possível carregar os dados" });
  }
}
