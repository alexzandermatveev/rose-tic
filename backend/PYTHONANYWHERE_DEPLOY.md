# PythonAnywhere Deployment Guide

## 1. Загрузка файлов на PythonAnywhere

1. Зайдите в панель управления PythonAnywhere
2. Перейдите в раздел **Files**
3. Создайте папку `mysite` в вашем домашнем каталоге
4. Загрузите файлы:
   - `pythonanywhere_app.py` → `/home/username/mysite/app.py`
   - `game_data.json` (если есть) → `/home/username/mysite/game_data.json`

## 2. Настройка Web App

1. Перейдите в раздел **Web**
2. Создайте новое Web приложение
3. Выберите **Manual configuration** (не Flask!)
4. Выберите Python 3.8+ версию

## 3. Конфигурация Web App

В разделе Code:
- **Source code**: `/home/username/mysite`
- **Working directory**: `/home/username/mysite`

В разделе Virtualenv:
- Создайте virtualenv: `/home/username/.virtualenvs/tic-tac-toe`

В разделе WSGI configuration file:
Замените содержимое на:

```python
import sys
import os

# Add your project directory to the sys.path
project_home = '/home/username/mysite'
if project_home not in sys.path:
    sys.path = [project_home] + sys.path

# Import your application
from app import app as application
```

## 4. Установка зависимостей

Откройте Bash консоль и выполните:

```bash
# Активируйте virtualenv
source /home/username/.virtualenvs/tic-tac-toe/bin/activate

# Установите зависимости
pip install fastapi uvicorn pydantic

# Для CORS поддержки
pip install starlette
```

## 5. Перенос данных (если нужно)

Если у вас есть данные из старого бэкенда:

1. Скопируйте `game_data.json` из старого бэкенда
2. Загрузите его в `/home/username/mysite/`
3. Убедитесь, что у файла правильные права доступа

## 6. Запуск и тестирование

1. Перезапустите Web приложение в панели PythonAnywhere
2. Проверьте логи на наличие ошибок
3. Протестируйте API:

```bash
curl https://yourusername.pythonanywhere.com/
```

## 7. Настройка CORS

Убедитесь, что в `app.py` есть правильная CORS конфигурация:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 8. Решение проблем

### Если 500 ошибка:
- Проверьте логи Web приложения
- Убедитесь, что все зависимости установлены
- Проверьте права доступа к файлам

### Если CORS ошибка:
- Убедитесь, что CORS middleware настроен правильно
- Проверьте, что Origin заголовок разрешен

### Если данные не загружаются:
- Проверьте путь к `game_data.json`
- Убедитесь, что файл существует и доступен для чтения/записи

## 9. Мониторинг

Регулярно проверяйте:
- Логи приложения
- Доступность API endpoints
- Целостность файла данных