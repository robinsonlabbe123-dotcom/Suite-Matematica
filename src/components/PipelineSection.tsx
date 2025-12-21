import { useMemo, useState } from 'react';
import { activityLabels, statusLabels, useData } from '../context/DataContext';
import { OpportunityState } from '../types';

const defaultOpportunity = {
  titulo: '',
  valor: 0,
  estado: 'nuevo' as OpportunityState,
  cierreEstimado: '',
  contactId: '',
};

const columns: OpportunityState[] = ['nuevo', 'en_progreso', 'ganado', 'perdido'];

export function PipelineSection() {
  const { opportunities, contacts, addOpportunity, updateOpportunity, deleteOpportunity, currency, activities } = useData();
  const [form, setForm] = useState(defaultOpportunity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo.trim()) {
      alert('El título es obligatorio');
      return;
    }
    if (!form.contactId) {
      alert('Selecciona un contacto');
      return;
    }
    if (form.valor < 0) {
      alert('El valor debe ser mayor o igual a 0');
      return;
    }
    addOpportunity({ ...form, valor: Number(form.valor) });
    setForm(defaultOpportunity);
  };

  const totals = useMemo(() => {
    const map: Record<OpportunityState, number> = { nuevo: 0, en_progreso: 0, ganado: 0, perdido: 0 };
    opportunities.forEach((o) => {
      map[o.estado] += o.valor;
    });
    return map;
  }, [opportunities]);

  const onDragStart = (id: string) => (event: React.DragEvent) => {
    event.dataTransfer.setData('text/plain', id);
  };

  const onDrop = (estado: OpportunityState) => (event: React.DragEvent) => {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/plain');
    if (id) updateOpportunity(id, { estado });
  };

  const relatedActivities = (id: string) => activities.filter((a) => a.opportunityId === id).length;

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h2>Pipeline</h2>
          <p className="muted">Kanban simple con totales por estado.</p>
        </div>
      </div>
      <div className="grid two">
        <form className="card" onSubmit={handleSubmit}>
          <div className="card-header">
            <h3>Nueva oportunidad</h3>
          </div>
          <label>
            Título*
            <input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required />
          </label>
          <label>
            Valor ({currency})
            <input
              type="number"
              min={0}
              value={form.valor}
              onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })}
            />
          </label>
          <label>
            Estado
            <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value as OpportunityState })}>
              {columns.map((c) => (
                <option key={c} value={c}>
                  {statusLabels[c]}
                </option>
              ))}
            </select>
          </label>
          <label>
            Fecha estimada de cierre
            <input
              type="date"
              value={form.cierreEstimado}
              onChange={(e) => setForm({ ...form, cierreEstimado: e.target.value })}
            />
          </label>
          <label>
            Contacto vinculado*
            <select
              value={form.contactId}
              onChange={(e) => setForm({ ...form, contactId: e.target.value })}
              required
            >
              <option value="">Selecciona un contacto</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} {c.empresa ? `(${c.empresa})` : ''}
                </option>
              ))}
            </select>
          </label>
          <button className="primary" type="submit">
            Crear oportunidad
          </button>
        </form>

        <div className="card stats">
          <h3>Métricas rápidas</h3>
          <div className="chips">
            {columns.map((c) => (
              <span key={c} className="chip">
                {statusLabels[c]}: {currency} {totals[c].toLocaleString('es-CL')}
              </span>
            ))}
          </div>
          <p className="muted">
            Total general (sin perdidos): {currency}{' '}
            {(totals.nuevo + totals.en_progreso + totals.ganado).toLocaleString('es-CL')}
          </p>
        </div>
      </div>

      <div className="kanban">
        {columns.map((column) => (
          <div
            key={column}
            className="kanban-column"
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop(column)}
          >
            <div className="kanban-header">
              <h4>{statusLabels[column]}</h4>
              <span className="muted">{totals[column].toLocaleString('es-CL')} {currency}</span>
            </div>
            <div className="kanban-cards">
              {opportunities
                .filter((o) => o.estado === column)
                .map((o) => {
                  const contact = contacts.find((c) => c.id === o.contactId);
                  return (
                    <div key={o.id} className="card opportunity" draggable onDragStart={onDragStart(o.id)}>
                      <div className="opportunity-head">
                        <div>
                          <p className="strong">{o.titulo}</p>
                          <p className="muted">{contact?.nombre || 'Sin contacto'} {contact?.empresa && `· ${contact.empresa}`}</p>
                        </div>
                        <button className="link danger" onClick={() => deleteOpportunity(o.id)}>
                          ×
                        </button>
                      </div>
                      <p className="muted">
                        Valor: {currency} {o.valor.toLocaleString('es-CL')}
                      </p>
                      <p className="muted">Cierre: {o.cierreEstimado || 'No definido'}</p>
                      <div className="opportunity-actions">
                        <select
                          value={o.estado}
                          onChange={(e) => updateOpportunity(o.id, { estado: e.target.value as OpportunityState })}
                        >
                          {columns.map((c) => (
                            <option key={c} value={c}>
                              {statusLabels[c]}
                            </option>
                          ))}
                        </select>
                        <span className="chip muted">{relatedActivities(o.id)} actividad(es)</span>
                      </div>
                    </div>
                  );
                })}
              {opportunities.filter((o) => o.estado === column).length === 0 && (
                <div className="empty">Arrastra una tarjeta aquí</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
