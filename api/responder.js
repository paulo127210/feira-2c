import { sql, ensureTable } from "../lib/db.js";

// Recebe uma resposta da pesquisa (público, anônimo, só inserção).
const KEYS = ["q1","q2","q3","q4","q5","q6","q7","q8","q9","q10","q11","q12","q13","q14","q15"];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ erro: "Método não permitido" });
  }
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const dados = {};
    for (const k of KEYS) {
      const v = body[k];
      if (v == null || v === "") continue;
      if (typeof v !== "string") return res.status(400).json({ erro: "Formato inválido" });
      dados[k] = v.trim().slice(0, k === "q15" ? 500 : 120);
    }
    if (!dados.q1) return res.status(400).json({ erro: "Resposta incompleta" });

    const dia = /^\d{4}-\d{2}-\d{2}$/.test(body.dia || "") ? body.dia : null;
    const semana = /^\d{4}-S\d{2}$/.test(body.semana || "") ? body.semana : null;

    await ensureTable();
    await sql`insert into respostas (dia, semana, dados) values (${dia}, ${semana}, ${JSON.stringify(dados)}::jsonb)`;
    return res.status(201).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ erro: "Não foi possível salvar agora" });
  }
}
