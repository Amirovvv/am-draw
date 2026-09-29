# amdraw v2 — план

Цель: публичный сайт, где любой вошедший человек рисует картинку с телефона или компьютера,
видит ленту, ставит лайки и добавляет в избранное. Запуск через Threads и другие соцсети.
Приоритеты: безопасность → надёжность → мобильный UX → скорость → красота кода.

## Принятые решения (не пересматривать без причины)

| Тема | Решение |
|---|---|
| Репозиторий | Этот же. Тег `v1` на старый `main`, работа в `feat/v2`, после релиза merge в `main` и удаление `feat/v2` |
| Фронтенд | Vue 3.5 + TypeScript strict + Vite + vue-router + Pinia (только клиентское состояние) |
| Серверное состояние | TanStack Vue Query (кэш, infinite scroll, optimistic updates) |
| Бэкенд | Только Supabase: Auth, Postgres + RLS, Storage, Edge Functions. Firebase удаляется полностью |
| Supabase-проект | Новый, чистый. Схема — миграциями в репо (`supabase/migrations`) |
| Хостинг фронта | Netlify (превью на каждый PR, Edge Function для OG-превью) |
| Рисовать | Только вошедшие. Смотреть ленту — все |
| Вход | Email-код (6 цифр — работает во встроенном браузере Threads) + Google + GitHub. Во встроенном браузере Google блокирует OAuth → email-код как основной путь + кнопка «Открыть в браузере» (Android `intent://`, iOS `x-safari-https://` + инструкция) |
| Почта | Разработка: встроенная почта Supabase (2 письма/час, только команде — хватает для тестов). Этап 7: Resend на своём домене (Resend требует верифицированный домен) |
| Языки | Русский + английский с первого этапа: vue-i18n, автоопределение по `navigator.language`, переключатель, выбор запоминается. Письма входа — на обоих языках |
| Домен | Разработка — поддомен Netlify. Свой домен — в этапе 7 (+ OAuth callback-и, Supabase redirect URLs, Resend DNS) |
| Лайки / избранное | Только вошедшие. `set_like(drawing_id, liked)` — идемпотентно, PK `(user_id, drawing_id)`, счётчик триггером. Клиент: optimistic + ≤1 запрос в полёте на рисунок + `keepalive` |
| Запись рисунков | Только через Edge Function `publish-drawing` (auth → rate limit → валидация → модерация → storage → insert). Клиенту прямая запись в `drawings` и Storage запрещена |
| Модерация | OpenAI `omni-moderation-latest` до публикации + жалобы (3 жалобы → скрыт) + админка |
| AI-перерисовка | Leonardo, за фича-флагом, квота на пользователя/день + общий дневной лимит, после модерации. Результат копируется в свой Storage и тоже модерируется. Webhook с секретом |
| Канвас | Pointer Events + perfect-freehand, штрихи хранятся векторно (дешёвый undo/redo), логический размер 1024×1024, экспорт WebP |
| Качество | ESLint 9 + Prettier, vue-tsc, Vitest, Playwright (эмуляция iPhone), pgTAP для SQL, GitHub Actions CI |

## Структура фронтенда

```
src/
  app/          — main.ts, App.vue, router, query client, глобальные стили/токены
  features/
    auth/       — сессия, guard, LoginView, детект in-app браузера
    canvas/     — движок (composable), тулбар, палитра, undo/redo, черновик
    drawings/   — лента, карточка, страница рисунка, публикация, профиль
    likes/      — лайки, избранное
    moderation/ — жалобы, админка
  shared/
    ui/         — AppButton, IconButton, BottomSheet, Toast, Avatar, Spinner, EmptyState
    lib/        — утилиты (время, форматирование)
  lib/
    supabase.ts, database.types.ts (генерируется)
supabase/
  migrations/, functions/, tests/ (pgTAP), seed.sql
netlify/edge-functions/og.ts
e2e/            — Playwright
```

Правила: компоненты не импортируют supabase напрямую — только через `features/*/api/*`.
Никаких `any`. Импорты через `@/`. Mobile-first CSS, токены в CSS custom properties.

## Этапы

Каждый этап = отдельная сессия Claude + отдельный PR в `feat/v2` + Netlify preview.
Этап считается готовым, когда выполнен его чеклист «Готово, когда».

### Этап 0 — Подготовка (git + аккаунты)
- [ ] Решить судьбу незакоммиченных правок в `main` (закоммитить как есть или отбросить)
- [ ] Тег `v1`, ветка `feat/v2`
- [ ] Пользователь создаёт: новый проект Supabase, Google OAuth client (Resend и домен — в этапе 7), GitHub OAuth app, ключ OpenAI (модерация), Sentry-проект
- [ ] Ротировать ключи из старого `.env` (Leonardo, Replicate, HuggingFace) — они больше не нужны или будут перевыпущены
Готово, когда: ветка создана, аккаунты есть, секреты НЕ в репозитории.

### Этап 1 — Каркас
- [ ] Удалить старый `src/`, лишние зависимости; `create-vue` (TS, router, pinia, vitest, playwright, eslint, prettier)
- [ ] `tsconfig` strict, `.nvmrc` (Node 22 LTS), алиас `@/`
- [ ] vue-i18n: ru + en, автоопределение, переключатель, все строки только через ключи (никакого текста в шаблонах)
- [ ] Дизайн-токены (цвета, отступы, радиусы, типографика), тёмная тема как в v1, шрифты self-hosted (@fontsource)
- [ ] UI-кит `shared/ui` + layout: верхняя панель, нижняя навигация на мобильных, `100dvh`, `safe-area-inset`
- [ ] `index.html`: title, favicon, theme-color, базовые OG-теги, `viewport-fit=cover`
- [ ] `netlify.toml`: SPA-редирект, security headers (CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, frame-ancestors)
- [ ] GitHub Actions: typecheck, lint, unit, build, e2e
Готово, когда: пустое приложение с навигацией открывается на iPhone без горизонтального скролла, CI зелёный.

### Этап 2 — Supabase: схема, безопасность, вход
- [ ] `supabase init`, локальный Supabase (Docker), миграции в репо
- [ ] Таблицы: `profiles` (username, avatar, role), `drawings` (owner, path, ai_path, status, like_count, created_at), `likes`, `favorites`, `reports`, `rate_limits`
- [ ] RLS на всех таблицах; Storage-бакеты: чтение публичное, запись только service role
- [ ] RPC `set_like`, `set_favorite` (security definer, идемпотентно, rate limit)
- [ ] Триггеры: счётчики, создание профиля при регистрации
- [ ] Генерация типов `database.types.ts`
- [ ] Auth: email OTP + Google + GitHub (redirect-flow, PKCE), шаблоны писем ru/en
- [ ] Фронт: auth store, guard, LoginView, возврат на исходную страницу после входа, детект in-app браузера + во встроенном браузере — email-код как основной путь + «Открыть в браузере» (intent:// на Android, x-safari-https:// на iOS)
- [ ] pgTAP-тесты RLS: чужой лайк, подделка owner, запись в Storage анонимом — всё запрещено
Готово, когда: вход работает всеми тремя способами, из встроенного браузера Threads можно войти по email-коду, тесты RLS зелёные.

### Этап 3 — Канвас (главный экран)
- [ ] Движок `useCanvasEngine`: Pointer Events, `getCoalescedEvents`, давление стилуса, perfect-freehand, векторные штрихи, рендер с учётом DPR
- [ ] Адаптивный размер (квадрат по ширине экрана), `touch-action: none`, блок скролла/зума/pull-to-refresh
- [ ] Инструменты: кисть, ластик, палитра + свой цвет, 3–5 размеров, undo/redo (кнопки + два пальца = undo), очистить (с подтверждением)
- [ ] Полноэкранный режим на мобильных, тулбар в зоне большого пальца
- [ ] Автосохранение черновика в IndexedDB
- [ ] Экспорт WebP 1024×1024, проверка «пустой холст»
- [ ] Unit-тесты движка, e2e: нарисовать → undo → redo
Готово, когда: рисовать пальцем на iPhone и Android так же приятно, как мышью; черновик переживает перезагрузку.

### Этап 4 — Публикация и AI
- [ ] Edge Function `publish-drawing`: проверка JWT → rate limit (напр. 5/час, 20/день) → валидация (WebP magic bytes, ≤1 МБ, 1024×1024) → модерация → Storage → insert
- [ ] Идемпотентность публикации (ключ из клиента) — двойной тап не создаёт дубль
- [ ] AI: квота, запуск Leonardo, webhook с секретом, копирование результата в Storage, модерация результата, статусы `pending/processing/done/error`, таймаут
- [ ] Клиент: прогресс публикации, понятные ошибки (тосты), черновик не теряется при ошибке
Готово, когда: нельзя опубликовать мимо функции, дубли невозможны, неприличная картинка не проходит.

### Этап 5 — Лента и социальное
- [ ] Лента: keyset-пагинация, infinite scroll, «Новые / Популярные», skeleton / empty / error состояния
- [ ] Карточка: лайк (кнопка + двойной тап), избранное, переключатель «Оригинал / AI», lazy-картинки с размерами (без прыжков вёрстки)
- [ ] Лайки/избранное: optimistic, сериализация запросов, `keepalive`, `cancelQueries`
- [ ] Страница рисунка `/d/:id`, «Поделиться» (Web Share API + копировать ссылку)
- [ ] Профиль `/u/:username`: рисунки, избранное (своё), редактирование ника, удаление своего рисунка
- [ ] e2e: 20 быстрых лайков → reload → консистентно; лайк → мгновенный reload → консистентно
Готово, когда: все e2e на сценарии лайков зелёные на эмуляции iPhone.

### Этап 6 — Защита и запуск
- [ ] Жалобы + автоскрытие + админка (role = admin)
- [ ] Netlify Edge Function: OG-превью для `/d/:id` (картинка рисунка в превью Threads)
- [ ] Privacy Policy + Terms, страница 404
- [ ] Sentry (ошибки), Umami/Plausible (аналитика без cookie)
- [ ] PWA (manifest, иконки, установка на экран)
- [ ] Бюджетные алерты: Supabase, OpenAI, Leonardo, Netlify
- [ ] Lighthouse mobile ≥ 90 по всем метрикам, a11y (фокус, aria, контраст)
- [ ] Самостоятельный пентест по чек-листу: подделка owner, обход rate limit, прямая запись в Storage, XSS в нике, спам лайками, SSRF, webhook без секрета
Готово, когда: чек-лист пентеста пройден, Lighthouse ≥ 90.

### Этап 7 — Релиз
- [ ] Свой домен: покупка, DNS на Netlify, обновить OAuth callback-и (Google, GitHub), Supabase Site URL/redirect URLs
- [ ] Resend: верификация домена (SPF, DKIM, DMARC), custom SMTP в Supabase, поднять лимит писем
- [ ] Merge `feat/v2` → `main`, удалить `feat/v2`, прод-деплой
- [ ] Старые рисунки v1 НЕ переносим (решение владельца 2026-09-29): v2 стартует с пустой лентой
- [ ] Отключить Firebase, старый Supabase-проект, старые Netlify functions, удалить/ротировать все старые ключи
Готово, когда: прод на v2, старый бэкенд выключен.

## Открытые вопросы
- Название домена — выбрать к этапу 7
