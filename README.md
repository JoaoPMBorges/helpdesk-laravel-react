# Horizon — Sistema de Gestão de Chamados Técnicos

Sistema de suporte técnico desenvolvido como projeto de portfólio. O frontend é em React + TypeScript, o backend em Laravel e tem integração com o Google Gemini para gerar um resumo automático de cada chamado.

## Funcionalidades

- Dashboard com contagem de chamados por status
- Lista de chamados com busca
- Abertura de chamados com validação e resumo por IA
- Detalhes do chamado com alteração de status e exclusão
- Fallback para dados locais caso o backend esteja fora

## Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Backend:** Laravel 13, PHP 8.3
- **Banco:** MySQL 8.0
- **IA:** Google Gemini API (gemini-2.0-flash)
- **Containers:** Docker + Docker Compose

---

## Como rodar

### Com Docker (recomendado)

Precisa ter o Docker Desktop instalado.

```bash
git clone <url-do-repositorio>
cd Projeto-portifolio

# Configure a chave do Gemini antes de subir
# Edite backend/.env e troque GEMINI_API_KEY pelo valor real

docker compose up --build
```

Na primeira execução o Docker instala as dependências, gera a APP_KEY, roda as migrations e popula o banco automaticamente.

- Frontend: http://localhost:5173
- API: http://localhost:8000/api/chamados

### Sem Docker

Precisa de PHP 8.3+, Composer, Node 20+ e MySQL 8.0.

```bash
# Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Configure DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD no .env
php artisan migrate --seed
php artisan serve

# Frontend (outro terminal)
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

---

## Configuração necessária

O único passo manual obrigatório é configurar a chave do Gemini no `backend/.env`:

```env
GEMINI_API_KEY=sua_chave_aqui
```

Você pega a chave gratuitamente em https://aistudio.google.com/app/apikey

> Sem a chave o sistema funciona normalmente, só o campo de resumo por IA fica vazio.

---

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/chamados` | Lista todos os chamados |
| POST | `/api/chamados` | Cria um novo chamado |
| GET | `/api/chamados/{id}` | Detalhes de um chamado |
| PUT | `/api/chamados/{id}` | Atualiza status/título/descrição |
| DELETE | `/api/chamados/{id}` | Remove um chamado |
| GET | `/api/chamados/estatisticas` | Contagem por status |

---

## Usuários de demonstração

Criados automaticamente pelo Seeder:

| Nome | E-mail | Papel |
|------|--------|-------|
| Horizon Suporte | suporte@horizon.com | suporte |
| Carlos Eduardo | carlos.silva@empresa.com.br | cliente |
| Mariana Souza | mariana.souza@tech.com.br | cliente |

Senha padrão: `senha123`

---

## Licença

MIT
