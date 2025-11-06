# Todo Telegram Mini App

ToDo менеджер для Telegram Mini App.

## Стек

**Frontend:** Vue 3, TypeScript, Pinia, TailwindCSS, Vite  
**Backend:** Elysia (Bun), TypeScript, PostgreSQL, Drizzle ORM

## Архитектура

Frontend построен по Feature-Sliced Design (app → pages → features → entities → shared).

Backend следует Clean Architecture с разделением на domain, application и infrastructure слои.

## Установка и запуск

```bash
# Установка зависимостей
npm install
cd backend && bun install && cd ..
cd frontend && npm install && cd ..

# Настройка .env
cp env.example backend/.env
# Добавьте TELEGRAM_BOT_TOKEN в backend/.env

# БД
psql -U postgres -c "CREATE DATABASE todo_miniapp;"
npm run db:generate
npm run db:migrate

# Запуск (одна команда)
npm run dev
```

Откроется frontend на http://localhost:5174 и backend на http://localhost:3000

## Работа с Telegram

Для локальной разработки используйте ngrok или аналоги:

```bash
ngrok http 5174
```

Полученный HTTPS URL добавьте в Menu Button бота через @BotFather.

Bot Token из @BotFather добавьте в `backend/.env`:
```env
TELEGRAM_BOT_TOKEN=ваш_токен
```

## API

```
POST /auth/telegram - аутентификация
GET /todos - список задач
POST /todos - создать задачу
PATCH /todos/:id/toggle - отметить выполненной
DELETE /todos/:id - удалить задачу
```

Авторизация через заголовок `X-User-Id`.

## Особенности

Валидация Telegram initData через HMAC-SHA256.

Frontend адаптируется под тему Telegram, поддерживает fullscreen и safe area.

## Команды

```bash
npm run dev         # запуск backend + frontend
npm run lint        # проверка кода
npm run format      # форматирование
```
