# Feira Empresarial 2º C — Pesquisa de preferências

Página de pesquisa (doces/salgados) com painel de resultados para o professor.

- `index.html` — pesquisa + painel (Chart.js)
- `api/responder.js` — POST público, grava uma resposta
- `api/respostas.js` — GET do painel, exige o PIN (`x-pin`)
- Banco: Postgres (Neon) conectado pela Vercel → variável `DATABASE_URL`

## Variáveis de ambiente na Vercel
| Nome | O que é |
|---|---|
| `DATABASE_URL` | criada automaticamente ao conectar o banco Neon em *Storage* |
| `PAINEL_PIN` | PIN que o professor digita para abrir o painel |

Painel: `https://SEU-DOMINIO/#relatorio`
