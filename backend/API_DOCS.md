# Rose Tic Tac Toe Backend API

## Описание
Простой бэкенд для Telegram мини-приложения крестики-нолики с хранением данных в JSON файле.

## Установка и запуск

1. Перейдите в папку backend:
```bash
cd backend
```

2. Установите зависимости:
```bash
pip install -r requirements_simple.txt
```

3. Запустите сервер:
```bash
python start_server.py
```

Сервер будет доступен по адресу: http://localhost:8000

## API Endpoints

### 1. Health Check
**GET /** - Проверка работоспособности сервера
```json
{
  "message": "Rose Tic Tac Toe API is running!",
  "timestamp": "2026-01-12T07:55:15.384585"
}
```

### 2. Запись результата игры
**POST /game-result** - Сохраняет результат игры
```json
// Request
{
  "user_id": 123456789,
  "username": "testuser",
  "status": "win",
  "difficulty": "master"
}

// Response
{
  "id": 1,
  "user_id": 123456789,
  "status": "win",
  "difficulty": "master",
  "promo_code": "28498",
  "created_at": "2026-01-12T07:55:35.754706"
}
```

### 3. Получение статистики пользователя
**GET /user/{user_id}/stats** - Возвращает статистику игрока
```json
{
  "user_id": 123456789,
  "username": "testuser",
  "total_games": 1,
  "wins": 1,
  "losses": 0,
  "draws": 0,
  "win_rate": 100.0,
  "favorite_difficulty": "master"
}
```

### 4. Валидация промокода
**POST /promo-code/validate** - Проверяет и активирует промокод
```json
// Request
{
  "code": "28498",
  "user_id": 123456789
}

// Response
{
  "code": "28498",
  "is_valid": true,
  "used_at": "2026-01-12T07:56:28.279682",
  "created_at": "2026-01-12T07:55:35.754706"
}
```

### 5. Таблица лидеров
**GET /leaderboard** - Возвращает топ игроков
```json
[
  {
    "user_id": 123456789,
    "username": "testuser",
    "wins": 1
  }
]
```

## Структура данных

Данные сохраняются в файл `game_data.json` в следующем формате:

```json
{
  "users": {
    "123456789": {
      "id": 123456789,
      "username": "testuser",
      "created_at": "2026-01-12T07:55:15.384585"
    }
  },
  "game_results": [
    {
      "id": 1,
      "user_id": 123456789,
      "status": "win",
      "difficulty": "master",
      "promo_code": "28498",
      "created_at": "2026-01-12T07:55:35.754706"
    }
  ],
  "promo_codes": {
    "28498": {
      "code": "28498",
      "user_id": 123456789,
      "game_result_id": 1,
      "is_used": true,
      "created_at": "2026-01-12T07:55:35.754706",
      "used_at": "2026-01-12T07:56:28.279682"
    }
  }
}
```

## Интеграция с фронтендом

Фронтенд уже настроен для работы с бэкендом. URL бэкенда установлен в файле `src/pages/Index.tsx`:
```typescript
const BACKEND_URL = 'http://localhost:8000';
```

## Тестирование API

 тестирование API с помощью PowerShell:

```powershell
# Health check
Invoke-RestMethod -Uri "http://localhost:8000/" -Method Get

# Record game result
Invoke-RestMethod -Uri "http://localhost:8000/game-result" -Method Post -ContentType "application/json" -Body '{"user_id": 123456789, "username": "testuser", "status": "win", "difficulty": "master"}'

# Get user stats
Invoke-RestMethod -Uri "http://localhost:8000/user/123456789/stats" -Method Get

# Validate promo code
Invoke-RestMethod -Uri "http://localhost:8000/promo-code/validate" -Method Post -ContentType "application/json" -Body '{"code": "28498", "user_id": 123456789}'

# Get leaderboard
Invoke-RestMethod -Uri "http://localhost:8000/leaderboard" -Method Get
```