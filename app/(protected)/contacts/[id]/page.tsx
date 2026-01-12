import { Timeline } from "@/components/Timeline";

const mockTimeline = [
  { id: "1", label: "Mensaje inbound", detail: "Quiero cotizar un sitio", timestamp: "2024-06-01" },
  { id: "2", label: "Nota", detail: "Interesado en plan premium", timestamp: "2024-06-02" },
];

export default function ContactDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-4">
      <div className="card">
        <h1 className="text-xl font-semibold">Contacto {params.id}</h1>
        <p className="text-sm text-slate-600">Resumen automático y campos enriquecidos.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card md:col-span-2">
          <h2 className="text-lg font-semibold">Timeline</h2>
          <Timeline items={mockTimeline} />
        </div>
        <div className="card space-y-2">
          <h2 className="text-lg font-semibold">Insights</h2>
          <p className="text-sm text-slate-700">Intención: cotizar web</p>
          <p className="text-sm text-slate-700">Presupuesto: ~$5k</p>
          <p className="text-sm text-slate-700">Urgencia: alta</p>
          <p className="text-sm text-slate-700">Próximos pasos: agendar demo</p>
        </div>
      </div>
    </div>
  );
}
