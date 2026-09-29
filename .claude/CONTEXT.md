# amdraw — живая память проекта

Полный план и принятые решения: `.claude/PLAN.md`. Читать его в начале каждой сессии.

## Текущий статус
- Этап: **1 — Каркас**, часть 1a готова (ветка `feat/v2-scaffold` → PR в `feat/v2`); дальше 1b
- Этап 0: аккаунты владельца ещё не созданы (нужны к этапу 2)
- Ветки `feat/v2` и `feat/v2-scaffold` и тег `v1` не запушены — `git push` запрещён в глобальных deny, пушит владелец
- Следующий шаг: push + PR 1a → новая сессия, этап 1b (токены, шрифты, unplugin-icons, UI-кит, layout, нижняя навигация)

## Окружение
- Node 22 через fnm: `eval "$(fnm env)" && fnm use 22` (системный node — 20)
- npm 10 из Node 22 падает (`edgesOut`) → использовать `node /opt/homebrew/lib/node_modules/npm/bin/npm-cli.js` (npm 11)
- VPN/TUN владельца (fake-IP 198.18.x) рвёт HTTP/1.1 → npm/Node качают с обрывами. Помогает выключить VPN или добавить registry.npmjs.org в DIRECT
- Проверки: `npm run check` (types, lint, format, unit), `npm run test:e2e` (build + preview + iPhone/desktop)

## Как продолжить в новой сессии
Написать: «Прочитай .claude/CONTEXT.md и .claude/PLAN.md, продолжаем этап N».

## Состояние v1 (для справки, код будет удалён)
- Vue 3 + Firebase Auth (popup) + Firestore (метаданные) + Supabase Storage (файлы) + Netlify functions (Leonardo AI)
- Критичные дыры v1: webhook и startGeneration без авторизации, запись в Firestore/Storage с клиента,
  токены Firebase в localStorage, нет модерации, канвас не работает на touch
- Последний коммит v1 (тег `v1`): AI-перерисовка через Leonardo; содержит регрессию — удалена обработка ошибок upload

## Журнал

## 2026-09-29 Аудит v1 и план v2
- Сделано: аудит безопасности/UX/кода v1, выбрана архитектура v2, составлен PLAN.md
- Решение: переписать с нуля в `feat/v2`; Supabase-only; вход email-код + Google + GitHub; ru + en; домен Netlify до этапа 7; рисуют только вошедшие; TanStack Vue Query
- Осталось: этап 0 → 7 по PLAN.md; открытый вопрос — имя домена (к этапу 7)

## 2026-09-29 Этап 0 — git
- Сделано: незакоммиченные правки v1 закоммичены в `main`, тег `v1`, ветка `feat/v2`, план закоммичен
- Решение: вернули email-вход (нужен для встроенного браузера Threads); языки ru + en; домен Netlify до этапа 7
- Решение: старые рисунки v1 не переносим, v2 стартует с пустой лентой
- Решение: модерация = OpenAI + Claude Haiku, первые 3 рисунка на ручную проверку, Telegram-бот (желательно, не блокер)
- Осталось: аккаунты (включая ключ Anthropic и Telegram-бота) (Supabase, Google OAuth, GitHub OAuth, OpenAI, Sentry), push тега и ветки

## 2026-09-29 Этап 1a — каркас
- Сделано: v1 удалён (`src`, `netlify/functions`, Firebase и пр.), create-vue (Vue 3.5, Vite 8, TS 6, router 5, pinia 4, Vitest 4, Playwright, ESLint 10 + oxlint); структура `app/ features/`; vue-i18n ru/en с типизированными ключами, автоопределение (uk/be/kk… → ru, иначе en), переключатель, `<html lang>`, заголовки вкладок; `index.html` (OG, theme-color, viewport-fit=cover, favicon.svg); security headers + `_headers`; CI (checks + e2e iPhone/desktop); `.env`/`.netlify` в `.gitignore`
- Решение: ESLint запрещает текст в шаблонах, `../` импорты и supabase вне `features/*/api`/`lib`; e2e всегда на prod-сборке под CSP; `style-src 'self'` без unsafe-inline
- Осталось: 1b; проверить, что CI зелёный после push

