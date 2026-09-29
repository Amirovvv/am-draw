# amdraw — живая память проекта

Полный план и принятые решения: `.claude/PLAN.md`. Читать его в начале каждой сессии.

## Текущий статус
- Этап: **1 — Каркас** готов (1a — PR #2, 1b — PR #3, CI зелёный); дальше этап 2
- Этап 0: аккаунты владельца ещё не созданы (нужны к этапу 2)
- Ветки `feat/v2` и `feat/v2-scaffold` и тег `v1` не запушены — `git push` запрещён в глобальных deny, пушит владелец
- Следующий шаг: владелец создаёт аккаунты этапа 0 (Supabase, Google OAuth, GitHub OAuth) → новая сессия, этап 2

## Окружение
- Node 22 через fnm: `eval "$(fnm env)" && fnm use 22` (системный node — 20)
- npm 10 из Node 22 падает (`edgesOut`) → использовать `node /opt/homebrew/lib/node_modules/npm/bin/npm-cli.js` (npm 11)
- VPN/TUN владельца (fake-IP 198.18.x) рвёт HTTP/1.1 → npm/Node качают с обрывами. Помогает выключить VPN или добавить registry.npmjs.org в DIRECT
- npm install из песочницы Claude всегда падает ECONNRESET → ставит владелец в своём терминале, с `--no-audit --no-fund` (обрыв был именно на audit)
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


## 2026-09-29 Этап 1b — токены, UI-кит, layout
- Сделано: `tokens.css` (цвета v1, отступы, радиусы, типографика, слои, safe-area); шрифты @fontsource (Exo 2 variable, Silkscreen только для логотипа); `unplugin-icons` + lucide; `shared/ui`: AppButton, IconButton, AppSpinner, AppAvatar, EmptyState; layout: AppHeader (навигация в шапке на ≥768px), BottomNav (мобильные, «Рисовать» акцентом), `100dvh`, safe-area; страницы на EmptyState; unit-тесты кита; e2e разделены на `*.mobile.spec.ts` / `*.desktop.spec.ts` через `testIgnore` проектов; проверено визуально на iPhone и десктопе
- Решение: `--color-text-muted` #8e8e93 (v1 #737373 не проходил AA); на зелёном/красном тёмный текст (белый не проходил AA); цвета аватаров — классы, не inline-стили (CSP); `vue/require-default-prop` выключен (конфликт с опциональными TS-пропсами); `tsconfig.vitest` lib ES2022; BottomSheet/Toast — по месту в этапах 3–4; simple-icons — в этапе 2
- Дизайн (по просьбе владельца, цвета и расположение те же): анимированная «пилюля» активного пункта в нижней навигации и шапке; у primary-кнопок градиент, блик и свечение; язык — сегментный контрол RU | EN на radio вместо select; EmptyState с мягким появлением; плавная смена страниц (`Transition`, `:key="route.path"`)
- Ревью: блокеров нет. Отложено: AppButton-ссылка при смене disabled/loading перемонтирует тег (возможна потеря фокуса) — проверить на этапе 4 с кнопкой публикации; зона 44px у IconButton может перекрываться в плотном тулбаре — учесть на этапе 3; `:has()` требует iOS 16.4+ (совпадает с дефолтным таргетом Vite 8)
- Итог: PR #3 смёржен в `feat/v2`, CI зелёный — этап 1 закрыт
