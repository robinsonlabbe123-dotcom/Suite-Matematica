const tasks = [
  { id: "1", title: "Llamar a Juan", status: "todo", due_at: "Hoy" },
  { id: "2", title: "Enviar propuesta a Ana", status: "doing", due_at: "Mañana" },
];

export default function TasksPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Tasks</h1>
          <p className="text-sm text-slate-600">Generadas manualmente o por automations.</p>
        </div>
        <button className="btn">Nueva task</button>
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="card flex items-center justify-between">
            <div>
              <p className="font-medium">{task.title}</p>
              <p className="text-xs text-slate-500">Due: {task.due_at}</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
              {task.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
