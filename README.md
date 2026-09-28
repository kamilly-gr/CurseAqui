# API de cursos e instrutores

API REST com Express, Prisma e SQLite.

## Executar

```bash
npm install
```

No Windows, crie o arquivo de ambiente:

```powershell
Copy-Item .env.example .env
```

Depois sincronize o banco e inicie a API:

```bash
npm run db:push
npm run dev
```

A API fica disponível em `http://localhost:3000`.

## Rotas

- `POST`, `GET` em `/instrutores`; `GET`, `PUT`, `DELETE` em `/instrutores/:id`
- `POST`, `GET` em `/cursos`; `GET`, `PUT`, `DELETE` em `/cursos/:id`

Para cadastrar um curso, envie:

```json
{
  "titulo": "Node.js do Zero",
  "descricao": "Curso introdutório de back-end com Node.js",
  "instrutor_id": 1
}
```