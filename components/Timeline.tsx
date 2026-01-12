export type TimelineItem = {
  id: string;
  label: string;
  detail: string;
  timestamp: string;
};

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-md border border-slate-200 bg-white p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">{item.label}</p>
            <span className="text-xs text-slate-500">{item.timestamp}</span>
          </div>
          <p className="text-sm text-slate-700">{item.detail}</p>
        </div>
      ))}
      {items.length === 0 && <p className="text-sm text-slate-500">Timeline vacía.</p>}
    </div>
  );
}
