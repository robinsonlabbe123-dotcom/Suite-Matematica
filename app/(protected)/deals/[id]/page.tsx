import { Timeline } from "@/components/Timeline";

const mockTimeline = [
  { id: "1", label: "Mensaje", detail: "Cliente pidió propuesta", timestamp: "2024-06-01" },
  { id: "2", label: "Cambio etapa", detail: "Pasó a Proposal", timestamp: "2024-06-02" },
];

export default function DealDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-4">
      <div className="card">
        <h1 className="text-xl font-semibold">Deal {params.id}</h1>
        <p className="text-sm text-slate-600">Status, contactos y actividad.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card md:col-span-2">
          <h2 className="text-lg font-semibold">Timeline</h2>
          <Timeline items={mockTimeline} />
        </div>
        <div className="card space-y-2">
          <h2 className="text-lg font-semibold">Insights</h2>
          <p className="text-sm text-slate-700">Próximos pasos: enviar propuesta</p>
          <p className="text-sm text-slate-700">Urgencia: media</p>
        </div>
      </div>
    </div>
  );
}
