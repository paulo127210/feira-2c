import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
export const sql = url ? neon(url) : null;

let ready = false;
export async function ensureTable() {
  if (!sql) throw new Error("Banco não configurado (DATABASE_URL ausente).");
  if (ready) return;
  await sql`
    create table if not exists respostas (
      id         bigserial primary key,
      created_at timestamptz not null default now(),
      dia        text,
      semana     text,
      dados      jsonb not null
    )`;
  ready = true;
}
