import { SimpleTable } from "@/components/Table";
import { KanbanBoard } from "@/components/Kanban";

const mockDeals = [
  { id: "1", title: "Sitio web corporativo", value: "$5k", contact: "Juan" },
  { id: "2", title: "Campaña Ads", value: "$3k", contact: "Ana" },
];

const mockContacts = [
  { id: "1", name: "Juan", email: "juan@example.com", status: "New" },
  { id: "2", name: "Ana", email: "ana@example.com", status: "Qualified" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <p className="text-xs text-slate-500">Deals abiertos</p>
          <p className="text-2xl font-semibold">6</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-500">Tareas pendientes</p>
          <p className="text-2xl font-semibold">4</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-500">Últimos leads</p>
          <p className="text-2xl font-semibold">3 hoy</p>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Pipeline rápido</h2>
          <a className="text-sm text-slate-600 hover:underline" href="/app/deals">
            Ver todo
          </a>
        </div>
        <KanbanBoard
          columns={[
            { id: "new", title: "New", cards: mockDeals },
            { id: "qualified", title: "Qualified", cards: [] },
            { id: "proposal", title: "Proposal", cards: [] },
          ]}
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Leads recientes</h2>
          <a className="text-sm text-slate-600 hover:underline" href="/app/contacts">
            Ir a contactos
          </a>
        </div>
        <SimpleTable
          columns={[
            { key: "name", label: "Nombre" },
            { key: "email", label: "Email" },
            { key: "status", label: "Status" },
          ]}
          data={mockContacts}
        />
      </section>
    </div>
  );
}
