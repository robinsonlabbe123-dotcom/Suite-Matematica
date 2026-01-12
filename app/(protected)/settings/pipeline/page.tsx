const stages = [
  { id: "1", name: "New", order_index: 1 },
  { id: "2", name: "Qualified", order_index: 2 },
  { id: "3", name: "Proposal", order_index: 3 },
  { id: "4", name: "Won", order_index: 4 },
];

export default function PipelineSettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Pipeline</h1>
      <div className="card space-y-2">
        <p className="text-sm text-slate-700">Etapas configurables por organización.</p>
        <ul className="space-y-1 text-sm text-slate-700">
          {stages.map((stage) => (
            <li key={stage.id} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
              <span>{stage.name}</span>
              <span className="text-xs text-slate-500">Orden {stage.order_index}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
