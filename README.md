# IT Бриф - Система збору вимог до IT-проєкту

## Опис

Веб-додаток для збору вимог до IT-проєкту у вигляді брифу для замовника з адміністративною панеллю для перегляду та редагування відповідей.

## Технології

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM (SQLite)
- NextAuth
- React Hook Form + Zod

## Швидкий старт

### 1. Встановлення залежностей

```bash
npm install
```

### 2. Ініціалізація бази даних

```bash
npx prisma migrate dev --name init
```

### 3. Створення адміністратора

```bash
npm run db:seed
```

**Облікові дані адміна:**
- Email: `admin@example.com`
- Пароль: `admin123`

### 4. Запуск

```bash
npm run dev
```

Відкрийте http://localhost:3000

## Сторінки

- `/brief` - Форма брифу
- `/admin` - Адмін-панель (потрібна авторизація)
- `/admin/login` - Вхід

## API Endpoints

- `POST /api/brief` - Створити бриф
- `GET /api/brief` - Отримати всі брифи
- `GET /api/brief/[id]` - Отримати бриф
- `PUT /api/brief/[id]` - Оновити бриф
- `DELETE /api/brief/[id]` - Видалити бриф

## Деплой на Vercel

1. Запуште на GitHub
2. Імпортуйте на Vercel
3. Додайте змінні середовища
4. Деплой

---

MIT