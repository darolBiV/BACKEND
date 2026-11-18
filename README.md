# PawsStore — интернет-магазин (Fastify + PostgreSQL + Redis)

Серверная часть и REST API интернет-магазина (вариант 3: Fastify, PostgreSQL 15+, Prisma ORM, Redis, Supabase, Koyeb) и клиентское приложение на React.

## Рабочий деплой

| Компонент | Ссылка |
|---|---|
| Frontend (Vercel) | `https://<project>.vercel.app` |
| Backend API (Koyeb) | `https://<service>.koyeb.app/api` |
| Swagger / OpenAPI | `https://<service>.koyeb.app/docs` |
| Health check | `https://<service>.koyeb.app/api/health` |

Тестовые пользователи (создаются сидом): `admin@example.com` / `Password123!` (admin), `customer@example.com` / `Password123!` (customer). Промокод — `SAVE10`.

## Стек

- **Backend:** Node.js 22, Fastify 5, TypeScript, Prisma ORM, JWT, bcrypt
- **БД:** PostgreSQL (локально — контейнер, в облаке — Supabase)
- **Кэш:** Redis (локально — контейнер, в облаке — Upstash Redis)
- **Медиа:** Supabase Storage
- **Хостинг:** Koyeb (Docker), фронтенд — Vercel

## Локальный запуск через Docker Compose

1. Скопируйте файл переменных окружения:
   ```bash
   cp .env.example .env
   ```
2. При необходимости измените значения в `.env` (обязательно задайте `JWT_SECRET`).
3. Соберите и запустите контейнеры:
   ```bash
   docker compose up --build
   ```
   Поднимутся сервисы `postgres`, `redis` и `app`. Миграции применяются автоматически при старте `app`.
4. Заполните базу тестовыми данными (из каталога `backend`, БД должна быть доступна на `localhost:5432` — для этого добавьте `ports: ["5432:5432"]` сервису `postgres` или запустите сид внутри сети compose):
   ```bash
   cd backend && npm install && npm run prisma:seed
   ```
5. API доступно на `http://localhost:5000`, Swagger — `http://localhost:5000/docs`.
6. Фронтенд:
   ```bash
   cd frontend && npm install && npm start
   ```
   Откроется `http://localhost:3000`.

## Переменные окружения

| Переменная | Описание | Пример |
|---|---|---|
| `NODE_ENV` | Режим работы | `production` |
| `HOST` | Адрес, на котором слушает сервер | `0.0.0.0` |
| `PORT` | Порт сервера | `5000` |
| `CORS_ORIGIN` | Разрешённые origin фронтенда, через запятую | `http://localhost:3000,https://pawsstore.vercel.app` |
| `POSTGRES_DB` | Имя БД (только docker compose) | `pet_store` |
| `POSTGRES_USER` | Пользователь БД (только docker compose) | `postgres` |
| `POSTGRES_PASSWORD` | Пароль БД (только docker compose) | `password` |
| `DATABASE_URL` | Строка подключения PostgreSQL для Prisma | `postgresql://user:pass@host:5432/db?schema=public` |
| `REDIS_URL` | Строка подключения Redis (`rediss://` для TLS) | `redis://localhost:6379` |
| `JWT_SECRET` | Секрет для подписи JWT | длинная случайная строка |
| `SUPABASE_URL` | URL проекта Supabase | `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role ключ Supabase (только на сервере!) | `eyJ...` |
| `SUPABASE_STORAGE_BUCKET` | Публичный bucket для изображений товаров | `product-images` |

Фронтенд: `REACT_APP_API_URL` — публичный адрес бэкенда (например, `https://<service>.koyeb.app`).

## Деплой в облако

### 1. Supabase (PostgreSQL + Storage)
1. Создайте проект на [supabase.com](https://supabase.com).
2. **Connect → Session pooler** — скопируйте строку подключения (порт `5432`, хост `aws-0-<region>.pooler.supabase.com`) и подставьте пароль. Это и есть `DATABASE_URL`. Session pooler работает по IPv4 и поддерживает `prisma migrate deploy`.
3. **Storage → New bucket** `product-images`, включите *Public bucket*.
4. **Project Settings → API**: `Project URL` → `SUPABASE_URL`, `service_role` → `SUPABASE_SERVICE_ROLE_KEY`.
5. Примените миграции и сид с локальной машины:
   ```bash
   cd backend
   DATABASE_URL="<supabase session pooler url>" npx prisma migrate deploy
   DATABASE_URL="<supabase session pooler url>" npm run prisma:seed
   ```

### 2. Redis (Upstash)
Создайте базу на [upstash.com](https://upstash.com) → скопируйте URL вида `rediss://default:<password>@<host>:6379` → `REDIS_URL`.

### 3. Backend на Koyeb (Docker)
1. **Create Web Service → GitHub**, репозиторий, ветка `main`.
2. Builder: **Dockerfile**, *Work directory*: `backend`.
3. Exposed port: `5000` (HTTP), health check: `HTTP /api/health`.
4. Environment variables: `NODE_ENV=production`, `HOST=0.0.0.0`, `PORT=5000`, `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET`, `CORS_ORIGIN=https://<project>.vercel.app`.
5. После деплоя проверьте `https://<service>.koyeb.app/api/health` и `/docs`.

### 4. Frontend на Vercel
1. **Add New Project** → репозиторий, *Root Directory*: `frontend`, Framework: Create React App.
2. Environment variable `REACT_APP_API_URL=https://<service>.koyeb.app`.
3. Файл `frontend/vercel.json` перенаправляет все маршруты на `index.html` (react-router).
4. После получения домена Vercel добавьте его в `CORS_ORIGIN` на Koyeb и сделайте Redeploy.

## Git Flow

Ветка `main` — стабильная, разработка в `dev` через ветки `feature/*`. Коммиты в формате Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`).
