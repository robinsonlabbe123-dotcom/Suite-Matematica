export default function WebhooksSettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Webhooks & API</h1>
      <div className="card space-y-2">
        <p className="text-sm text-slate-700">Configura tokens y URLs para captura de leads.</p>
        <p className="text-xs text-slate-600">POST /api/webhooks/lead con header X-Webhook-Token.</p>
        <p className="text-xs text-slate-600">Vercel Scheduler → /api/cron/autopilot.</p>
      </div>
    </div>
  );
}
