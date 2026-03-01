# Fafa

Бэкенд на Node.js (Express + MongoDB) с авторизацией по JWT.

## Требования

- Node.js 18+
- MongoDB (локально или облако, например MongoDB Compass)

## Установка

```
# Установить зависимости
npm install

# Скопировать пример переменных окружения и заполнить
cp .env.example.env
```

## Переменные окружения (.env)

| Переменная   | Описание                    | Пример                          |
|-------------|-----------------------------|---------------------------------|
| `PORT`      | Порт сервера                | `5000`                          |
| `MONGO_URI` | Строка подключения к MongoDB| `mongodb://localhost:27017/fafa`|
| `JWT_SECRET`| Секрет для подписи JWT      | Любая длинная случайная строка  |

Обязательны: `MONGO_URI`, `JWT_SECRET`. Без них приложение не запустится.

## Запуск
```bash
# Режим разработки (с автоперезапуском)
npm run dev
```

Сервер по умолчанию: `http://localhost:5001`.

## Структура проекта

```
auth/
├── index.js              # Точка входа: проверка .env, подключение к БД, запуск сервера
├── src/
│   ├── app.js            # Express-приложение: middleware, маршруты
│   ├── config/
│   │   └── settings.js   # Настройки (port, mongoUri, jwtSecret, validateEnv)
│   ├── controllers/     # Обработчики запросов (тонкий слой)
│   │   └── authController.js
│   ├── services/        # Бизнес-логика (работа с данными, токены)
│   │   └── authService.js
│   ├── routes/          # Маршруты API
│   │   └── auth.js
│   ├── middleware/      # Middleware (авторизация по JWT и т.д.)
│   │   └── auth.js
│   └── models/          # Модели Mongoose
│       └── User.js
├── .env.example
├── .env                 # Не коммитить (уже в .gitignore)
├── package.json
└── README.md
```

- **Controllers** — принимают `req`/`res`, вызывают **services**, отдают ответ.
- **Services** — регистрация, вход, выдача JWT, работа с моделями.
- **Routes** — привязка URL к контроллерам и middleware.

## API

### Без авторизации

- **GET /**  
  Ответ: `Сервер работает!`

- **POST /api/auth/register**  
  Регистрация.  
  Тело: `{ "email": "user@example.com", "password": "secret123" }`  
  Ответ: `{ "message", "token", "user": { "id", "email" } }`

- **POST /api/auth/login**  
  Вход.  
  Тело: `{ "email", "password" }`  
  Ответ: `{ "token", "user": { "id", "email" } }`

### С авторизацией

- **GET /api/auth/me**  
  Текущий пользователь.  
  Заголовок: `Authorization: Bearer <token>`  
  Ответ: `{ "user": { "_id", "email" } }` (пароль не отдаётся)

## Примеры запросов (curl)

```bash
# Регистрация
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Вход
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Текущий пользователь (подставь свой token)
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Скрипты (package.json)

| Команда     | Действие                          |
|------------|------------------------------------|
| `npm run dev` | Запуск с nodemon (перезапуск при изменениях) |

При необходимости можно добавить `"start": "node index.js"` для продакшена.


