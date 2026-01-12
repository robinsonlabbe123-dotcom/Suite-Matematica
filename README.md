# CRM + Autopilot (Next.js + Supabase)

MicroSaaS multi-tenant para capturar leads, convertirlos en contactos/deals, resumir conversaciones y programar follow-ups automáticos.

## Stack
- Next.js 14 (App Router) + TypeScript + Tailwind
- Supabase (Postgres + Auth + RLS)
- Deploy sugerido: Vercel + Supabase

## Configuración local
1. Copia `.env.example` a `.env.local` y completa:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `WEBHOOK_TOKEN` (para /api/webhooks/lead)
   - `CRON_SECRET` (para /api/cron/autopilot)
   - `OPENAI_API_KEY` (opcional, usa DummyProvider por defecto)
2. Instala dependencias: `pnpm install` (o `npm install`).
3. Ejecuta migraciones en Supabase: importa `supabase/migrations/0001_init.sql`.
4. Genera seed de demo: `pnpm seed` (requiere `SUPABASE_SERVICE_ROLE_KEY`).
5. Levanta la app: `pnpm dev`.

## Endpoints clave
### Webhook de leads
`POST /api/webhooks/lead`
Headers: `X-Webhook-Token: <WEBHOOK_TOKEN>`
Body ejemplo:
```json
{
  "org_id": "<org>",
  "channel": "whatsapp",
  "from": { "name": "Juan", "phone": "+569..." },
  "message": { "text": "Quiero cotizar un sitio" },
  "meta": { "external_thread_id": "abc123" }
}
```
Curl:
```bash
curl -X POST http://localhost:3000/api/webhooks/lead \
  -H "X-Webhook-Token: $WEBHOOK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"org_id":"<org>","channel":"whatsapp","from":{"name":"Juan","phone":"+569"},"message":{"text":"Hola"}}'
```

### Cron de autopilot
`POST /api/cron/autopilot`
Headers: `Authorization: Bearer <CRON_SECRET>`
Curl:
```bash
curl -X POST http://localhost:3000/api/cron/autopilot \
  -H "Authorization: Bearer $CRON_SECRET"
```
Configura Vercel Scheduler para llamar este endpoint con la cabecera.

## RLS
- Todas las tablas tienen `org_id` y políticas que requieren pertenencia en `org_members` para leer/escribir.
- Owners/Admin pueden insertar/actualizar miembros.
- Verificación: intenta hacer `select` en `contacts` desde un usuario sin fila en `org_members` → retorna 0 filas.

## Seed de demo
`scripts/seed.ts` crea organización demo, pipeline stages, 3 contactos, 3 deals, 1 automation y un hilo de conversación con mensajes para generar insights.

## UI rápida (App Router)
- `/app/dashboard` KPIs + pipeline.
- `/app/contacts` tabla y detalle con timeline.
- `/app/deals` kanban.
- `/app/tasks` lista de tareas.
- `/app/settings/*` configuración de org, pipeline, automations, webhooks.

## Checklist
### v1 listo para vender
- [x] Multi-tenant por organización con RLS.
- [x] Captura de leads manual/webhook.
- [x] Deals + pipeline + timeline básico.
- [x] Resumen/insights con Dummy AI provider.
- [x] Autopilot: tasks + drafts vía cron endpoint.
- [x] Seed/demo y docs.

### v2 mejoras
- [ ] Conectar OpenAI real para insights y drafts.
- [ ] UI de drag & drop real en Kanban.
- [ ] Gestión de miembros completa en settings.
- [ ] Notificaciones por email/slack para tareas.
- [ ] Tests e2e y despliegue CI.
