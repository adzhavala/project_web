# Project Web

## Швидкий старт

### 1. Встановити залежності

```bash
python -m pip install -r requirements.txt
```

або

```bash
python -m pip install flask flask-cors
```

### 2. Запустити бекенд

```bash
cd backend
python app.py
```

Сервер запуститься на http://127.0.0.1:5000/

### 3. Запустити frontend (опціонально)

```bash
cd frontend
python -m http.server 8000
```

Відкрити у браузері http://127.0.0.1:8000/

### Перевірка

- Бекенд: http://127.0.0.1:5000/
- Тест задачі: POST http://127.0.0.1:5000/task з body `{"n": 5}`
- Frontend консоль покаже результат виконання heavy_task
