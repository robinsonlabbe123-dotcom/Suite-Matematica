export type KanbanColumn = {
  id: string;
  title: string;
  cards: { id: string; title: string; value?: string; contact?: string }[];
};

export function KanbanBoard({ columns }: { columns: KanbanColumn[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {columns.map((col) => (
        <div key={col.id} className="card">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase text-slate-600">{col.title}</h3>
            <span className="text-xs text-slate-500">{col.cards.length} deals</span>
          </div>
          <div className="space-y-2">
            {col.cards.map((card) => (
              <div key={card.id} className="rounded-md border border-slate-200 p-2">
                <p className="text-sm font-medium">{card.title}</p>
                {card.contact && <p className="text-xs text-slate-500">{card.contact}</p>}
                {card.value && <p className="text-xs text-slate-500">{card.value}</p>}
              </div>
            ))}
            {col.cards.length === 0 && (
              <p className="text-xs text-slate-500">No deals in esta etapa.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
