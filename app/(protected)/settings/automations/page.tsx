const automations = [
  {
    id: "1",
    name: "Follow-up 48h New",
    trigger_stage: "New",
    inactivity_hours: 48,
    task: "Hacer follow-up al lead",
  },
];

export default function AutomationSettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Automations</h1>
      <div className="card space-y-2">
        <p className="text-sm text-slate-700">Crea reglas de autopilot por etapa.</p>
        {automations.map((auto) => (
          <div key={auto.id} className="rounded-md border border-slate-200 p-3">
            <p className="font-medium">{auto.name}</p>
            <p className="text-sm text-slate-600">
              Si un deal en {auto.trigger_stage} está inactivo por {auto.inactivity_hours}h → {auto.task}
            </p>
          </div>
        ))}
        <button className="btn">Nueva automation</button>
      </div>
    </div>
  );
}
