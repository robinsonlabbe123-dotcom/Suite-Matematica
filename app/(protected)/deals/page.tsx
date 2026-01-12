import { KanbanBoard } from "@/components/Kanban";

const columns = [
  {
    id: "new",
    title: "New",
    cards: [
      { id: "1", title: "Implementación CRM", contact: "Juan", value: "$5k" },
      { id: "2", title: "Onboarding SaaS", contact: "Ana", value: "$2k" },
    ],
  },
  { id: "qualified", title: "Qualified", cards: [] },
  { id: "proposal", title: "Proposal", cards: [{ id: "3", title: "Consultoría", contact: "Luis", value: "$8k" }] },
  { id: "won", title: "Won", cards: [] },
];

export default function DealsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Deals</h1>
          <p className="text-sm text-slate-600">Kanban por etapa configurable.</p>
        </div>
        <button className="btn">Nuevo deal</button>
      </div>
      <KanbanBoard columns={columns} />
    </div>
  );
}
